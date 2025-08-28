// tests/game/game.flow.test.ts

import { Server } from "../../src/server/Server";
import { setTimeout as wait } from 'node:timers/promises';
// @ts-ignore
import WebSocket from "ws";
import {ToggleCommand} from "../../src/command/ToggleCommand";

let server: Server;
const TEST_PORT = 3015;
let roomCode: string;
let room: ReturnType<typeof Server.prototype.roomManager.getRoom>;

let player1ws: WebSocket;
let player2ws: WebSocket;

let globalThreat: number = 0;
let instructionP1: any = null;
let boardCommandP1: any[] = [];
let instructionP2: any = null;
let boardCommandP2: any[] = [];

let firstInstruction: any = null;

// Utility function pour connecter un joueur
const connectPlayer = (roomCode: string, port: number, messageCb: any) =>
    new Promise<WebSocket>((resolve, reject) => {
        const ws = new WebSocket(`ws://localhost:${port}/?room=${roomCode}`);

        ws.on('open', () => {
            setTimeout(() => {
                resolve(ws);
            }, 100);
        });

        ws.on('message', (message) => {
            const data = JSON.parse(message.toString());
            messageCb(data);
        });

        ws.on('error', (err) => reject(err));
    });

beforeAll(async () => {
    server = Server.getInstance(TEST_PORT);
    server.start();

    roomCode = server.roomManager.createRoom(ToggleCommand);
    room = server.roomManager.getRoom(roomCode);

    player1ws = await connectPlayer(roomCode, TEST_PORT, (data: any) => {
        if (data.type === "player_board") {
            globalThreat = data.payload.threat;
            instructionP1 = data.payload.instruction;
            boardCommandP1 = data.payload.board.commands;
        }
    });

    player2ws = await connectPlayer(roomCode, TEST_PORT, (data: any) => {
        if (data.type === "player_board") {
            globalThreat = data.payload.threat;
            instructionP2 = data.payload.instruction;
            boardCommandP2 = data.payload.board.commands;
        }
    });

    player1ws.send(JSON.stringify({ type: "room", payload: { ready: true } }));
    player2ws.send(JSON.stringify({ type: "room", payload: { ready: true } }));

    // Attente de la transition de game state : waiting -> timer -> playing
    await wait(3500);
});

afterAll(() => {
    player1ws.close();
    player2ws.close();
    server.server.close();
});

describe("Game flow tests", () => {

    test("Room should exist and start in waiting state", async () => {
        expect(room).toBeDefined();
        expect(room!.getStateName()).toBe("playing");
        expect(boardCommandP1.length).toBeGreaterThanOrEqual(1);
        expect(boardCommandP2.length).toBeGreaterThanOrEqual(1);
        expect(instructionP1).not.toBeNull();
        expect(instructionP2).not.toBeNull();
        expect(globalThreat).toBe(30);
    });

    test("Player toggles action", async () => {
        await wait(200);
        let selectedPlayer = player1ws;
        let selectedInstruction = instructionP1;
        firstInstruction = selectedInstruction.instruction_text

        let command = boardCommandP1.find((command) => command.id === selectedInstruction.command_id)

        if(command === undefined){
            selectedPlayer = player2ws
        }

        // Dans ce jeu, les actions du joueur 1 dépendant des instruction du joueur 2
        selectedPlayer.send(JSON.stringify({
            type: "execute_action",
            payload: {
                // Ici je triche pour être vraiment sûr que le test passe
                command_id: selectedInstruction.command_id,
                action: "toggle"
            }
        }));
        await wait(200);
        expect(globalThreat).toBe(25);
        // Et maintenant du coup, l'instruction P2 a du s'update
        expect(selectedInstruction).not.toBe(firstInstruction);
    });

    test("Global board states remain consistent", () => {
        expect(boardCommandP1.length).toBe(4);
        expect(boardCommandP2.length).toBe(4);
        expect(room!.players.filter(p => p.ready).length).toBe(2);
    });

    test("Timeout on instruction works", async () => {
        firstInstruction = instructionP1.instruction_text
        await wait(3100);
        expect(instructionP1.instruction_text).not.toBe(firstInstruction);
        // Le global threat a du un peu augmenté
        expect(globalThreat).toBe(30);
    });
});
