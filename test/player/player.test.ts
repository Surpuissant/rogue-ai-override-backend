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

const connectPlayer = (roomCode: string, port: number, messageCb: any) =>
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
            messageCb(data)
        })

        ws.on('error', (err) => reject(err));
    });

describe("Player joins room and create one", () => {
    test("should create a room, connect to it and update his ready property", async () => {
        const roomCode = server.roomManager.createRoom();

        const room = server.roomManager.getRoom(roomCode);
        expect(room).toBeDefined();
        expect(room!.getStateName()).toBe("waiting");

        let boardCommandP1: any[] = [];
        let boardCommandP2: any[] = [];
        const p1cb = (data: any) => {
            if(data.type === "player_board") {
                console.warn(data.payload)
                boardCommandP1 = data.payload.board.commands
            }
        }
        let player1ws = await connectPlayer(roomCode, TEST_PORT, p1cb);
        const p2cb = (data: any) => {
            if(data.type === "player_board") {
                boardCommandP2 = data.payload.board.commands
            }
        }
        let player2ws = await connectPlayer(roomCode, TEST_PORT, p2cb);

        expect(room!.getStateName()).toBe("ready");

        player1ws.send(
            JSON.stringify({ type: "room", payload: { ready: true } })
        )

        await wait(1000)

        expect(room!.players.filter(p => p.ready).length).toBe(1);

        player2ws.send(
            JSON.stringify({ type: "room", payload: { ready: true } })
        )

        await wait(500)

        expect(room!.players.filter(p => p.ready).length).toBe(2);
        expect(room!.getStateName()).toBe("timer");
        await wait(3000)
        expect(room!.getStateName()).toBe("playing");
        // Il devrait y avoir au moins 1 commande ^^'
        expect(boardCommandP1.length).toBe(4);
        expect(boardCommandP2.length).toBe(4);

        player1ws.send(
            JSON.stringify({ type: "execute_action", payload: {
                    "command_id": boardCommandP1[0].id,
                    "action": "toggle"
                }
            })
        )
        await wait(200)

        // Normalement, on a activé juste avant le levier donc ça devrait être top
        expect(boardCommandP1[0].actual_status).toBe('active');

        player1ws.send(
            JSON.stringify({ type: "execute_action", payload: {
                    "command_id": boardCommandP1[0].id,
                    "action": "toggle"
                }
            })
        )
        await wait(200)

        // Et là, magie, il est baissé
        expect(boardCommandP1[0].actual_status).toBe('inactive');


    }, 30000);
});