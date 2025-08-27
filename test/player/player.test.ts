// Pour ces tests là, je vais instancier un Server à la main parce que je veux
// pouvoir controller vraiment l'environnement et pas juste en tant que client

import { Server } from "../../src/server/Server"
import { setTimeout as wait } from 'node:timers/promises';
import WebSocket from "ws";

let server: Server;
const TEST_PORT: number = 3011;

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

        ws.on('message', (message) => {
            const str = message.toString();
            const data = JSON.parse(str);
            console.log("Message reçu:", data);
        })

        ws.on('error', (err) => reject(err));
    });

describe("Player joins room and create one", () => {
    test("should create a room, connect to it and update his ready property", async () => {
        const roomCode = server.roomManager.createRoom();

        const room = server.roomManager.getRoom(roomCode);
        expect(room).toBeDefined();
        expect(room!.getStateName()).toBe("waiting");

        let player1ws = await connectPlayer(roomCode, TEST_PORT);
        let player2ws = await connectPlayer(roomCode, TEST_PORT);

        expect(room!.getStateName()).toBe("ready");

        player1ws.send(
            JSON.stringify({ type: "room", payload: { ready: true } })
        )

        await wait(1000)

        expect(room!.players.filter(p => p.ready).length).toBe(1);

    });
});