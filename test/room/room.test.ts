// Pour ces tests là, je vais instancier un Server à la main parce que je veux
// pouvoir controller vraiment l'environnement et pas juste en tant que client

import { Server } from "../../src/server/Server"
import axios from "axios";
import { setTimeout as wait } from 'node:timers/promises';
import WebSocket from "ws";

let server: Server;
const TEST_PORT: number = 3010;

beforeAll(() => {
    server = Server.getInstance(TEST_PORT);
    server.start()
})

afterAll(() => {
    server.server.close()
})

const connectPlayer = (roomCode: string, port: number) =>
    new Promise<WebSocket>((resolve, reject) => {
        const ws = new WebSocket(`ws://localhost:${port}/?room=${roomCode}`);

        ws.on('open', () => {
            setTimeout(() => {
                try {
                    resolve(ws);
                } catch (err) {
                    reject(err);
                }
            }, 100);

        });

        ws.on('error', (err) => reject(err));
    });

describe("Room creation and state", () => {
    test("should create a room, connect to it and verify its state", async () => {
        const roomCode = server.roomManager.createRoom();

        const room = server.roomManager.getRoom(roomCode);
        expect(room).toBeDefined();
        expect(room!.getStateName()).toBe("waiting");

        let player1ws = await connectPlayer(roomCode, TEST_PORT);
        let player2ws = await connectPlayer(roomCode, TEST_PORT);

        expect(room!.getStateName()).toBe("ready");

        let player3ws = await connectPlayer(roomCode, TEST_PORT);
        let player4ws = await connectPlayer(roomCode, TEST_PORT);
        let player5ws = await connectPlayer(roomCode, TEST_PORT);
        let player6ws = await connectPlayer(roomCode, TEST_PORT);

        expect(room!.getStateName()).toBe("full");

        player6ws.close()

        await wait(500)

        expect(room!.getStateName()).toBe("ready");
    });
});