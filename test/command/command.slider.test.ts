// tests/game/game.flow.test.ts

import { Server } from "../../src/server/Server";
import { setTimeout as wait } from 'node:timers/promises';
// @ts-ignore
import WebSocket from "ws";
import { PlayingState } from "../../src/room/roomState/PlayingState";
import { SliderCommand } from "../../src/command/SliderCommand";

let server: Server;
const TEST_PORT = 3022;
let roomCode: string;
let room: ReturnType<typeof Server.prototype.roomManager.getRoom>;

let player1ws: WebSocket;
let player2ws: WebSocket;

let globalThreat: number = 0;
let instructionP1: any = null;
let boardCommandP1: any[] = [];
let instructionP2: any = null;
let boardCommandP2: any[] = [];

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

    roomCode = server.roomManager.createRoom(SliderCommand);
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

describe("Room Rule Tests", () => {
    test("Room should only have Slider Command", () => {
        expect(room).toBeDefined();
        expect(room!.getStateName()).toBe("playing");
        (room!.state as PlayingState).commandPlayer.forEach(board => {
            board.commands.forEach((command) => {
                expect(command).toBeInstanceOf(SliderCommand);
            })
        });
    });

    test("Player do GOOD action on slider (good job player)", async () => {
        await wait(200);
        let selectedPlayer = player1ws;
        let selectedInstruction = instructionP1;
        let firstInstruction = selectedInstruction.instruction_text

        let command = boardCommandP1.find((command) => command.id === selectedInstruction.command_id)

        if(command === undefined){
            selectedPlayer = player2ws
        }

        // Dans ce jeu, les actions du joueur 1 dépendant des instruction du joueur 2
        selectedPlayer.send(JSON.stringify({
            type: "execute_action",
            payload: {
                // Ici je triche pour être vraiment sûr que le test passe et que les sliders fonctionnent
                command_id: selectedInstruction.command_id,
                action: selectedInstruction.expected_status
            }
        }));
        await wait(200);
        expect(globalThreat).toBe(25);
        expect(selectedInstruction).not.toBe(firstInstruction);
    });

    test("Player do bad action on slider", async () => {
        await wait(200);
        let selectedPlayer = player1ws;
        let selectedInstruction = instructionP1;
        let firstInstruction = selectedInstruction.instruction_text

        let command = boardCommandP1.find((command) => command.id === selectedInstruction.command_id)

        if(command === undefined){
            selectedPlayer = player2ws
        }

        // Dans ce jeu, les actions du joueur 1 dépendent des instructions du joueur 2
        selectedPlayer.send(JSON.stringify({
            type: "execute_action",
            payload: {
                // Ici, je triche pour être vraiment sûr que le test passe et que les sliders fonctionnent
                command_id: selectedInstruction.command_id,
                action: Number(selectedInstruction.expected_status) + 1
            }
        }));
        await wait(200);
        expect(globalThreat).toBe(30);
        expect(selectedInstruction).not.toBe(firstInstruction);
    });
});
