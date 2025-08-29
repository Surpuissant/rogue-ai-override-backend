// tests/game/game.flow.test.ts

import { Server } from "../../src/server/Server";
import { setTimeout as wait } from 'node:timers/promises';
// @ts-ignore
import WebSocket from "ws";
import {ToggleCommand} from "../../src/command/ToggleCommand";
import CONFIG from "../../src/Config";

let server: Server;
const TEST_PORT = 3013;
let roomCode: string;
let room: ReturnType<typeof Server.prototype.roomManager.getRoom>;

let player1ws: WebSocket;
let player2ws: WebSocket;

let globalThreat: number = 0;
let instructionP1: any = null;
let boardCommandP1: any[] = [];
let instructionP2: any = null;
let boardCommandP2: any[] = [];


let win: any = null;

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
        if(data.type === "game_state") {
            if(data.payload.state === "end_state") {
                win = data.payload.win
            }
        }
    });

    player2ws = await connectPlayer(roomCode, TEST_PORT, (data: any) => {
        if (data.type === "player_board") {
            globalThreat = data.payload.threat;
            instructionP2 = data.payload.instruction;
            boardCommandP2 = data.payload.board.commands;
        }
        if(data.type === "game_state") {
            if(data.payload.state === "end_state") win = data.payload.win
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

    test("Room should exist and start in waiting state", () => {
        expect(room).toBeDefined();
        expect(room!.getStateName()).toBe("playing");
        expect(boardCommandP1.length).toBeGreaterThanOrEqual(1);
        expect(boardCommandP2.length).toBeGreaterThanOrEqual(1);
        expect(instructionP1).not.toBeNull();
        expect(instructionP2).not.toBeNull();
        expect(globalThreat).toBe(CONFIG.STARTING_THREAT);
    });

    test("Verify game is winnable", async () => {
        // Tant qu'il y a pas de win, il faut réessayer
        while(win === null) {
            let selectedPlayer = player1ws;
            let selectedInstruction = instructionP1;

            let command = boardCommandP1.find((command) => command.id === selectedInstruction.command_id)

            if(command === undefined){
                selectedPlayer = player2ws
            }

            selectedPlayer.send(JSON.stringify({
                type: "execute_action",
                payload: { command_id: selectedInstruction.command_id, action: "toggle" }
            }));
            await wait(1200);
        }
        expect(room?.getStateName()).toBe("end");
        expect(win).toBe(true);
    }, 120000);

    test("Everyone leave the game", async () => {
        // Bon en gros si tout le monde quitte la room, elle existe plus normalement
        expect(server.roomManager.rooms.size).toBe(1);

        player1ws.close();
        player2ws.close();

        await wait(200);

        expect(server.roomManager.rooms.size).toBe(0);
    })
});
