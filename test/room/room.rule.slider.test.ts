// tests/game/game.flow.test.ts

import { Server } from "../../src/server/Server";
import { setTimeout as wait } from 'node:timers/promises';
// @ts-ignore
import WebSocket from "ws";
import { PlayingState } from "../../src/room/roomState/PlayingState";
import {SliderCommand} from "../../src/command/SliderCommand";

let server: Server;
const TEST_PORT = 3020;
let roomCode: string;
let room: ReturnType<typeof Server.prototype.roomManager.getRoom>;

let player1ws: WebSocket;
let player2ws: WebSocket;

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
    });

    player2ws = await connectPlayer(roomCode, TEST_PORT, (data: any) => {
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


});
