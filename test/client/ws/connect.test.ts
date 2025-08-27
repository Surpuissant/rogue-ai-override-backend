import WebSocket from 'ws';
import axios from 'axios';

describe('WebSocket Room Connections', () => {
    const createRoom = async () => {
        const res = await axios.post('http://localhost:3000/create-room');
        return res.data.roomCode;
    };

    const connectPlayer = (roomCode: string) =>
        new Promise<WebSocket>((resolve, reject) => {
            const ws = new WebSocket(`ws://localhost:3000/?room=${roomCode}`);

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

    test('1 player should create a Room and join it', async () => {
        const roomCode = await createRoom();
        const player = await connectPlayer(roomCode);
        expect(player.readyState).toBe(WebSocket.OPEN);
        player.close();
    });

    test('2 players should connect to the same Room', async () => {
        const roomCode = await createRoom();
        const [player1, player2] = await Promise.all([connectPlayer(roomCode), connectPlayer(roomCode)]);

        [player1, player2].forEach((p) => expect(p.readyState).toBe(WebSocket.OPEN));

        player1.close();
        player2.close();
    });

    test('7 players should connect to the same Room', async () => {
        const roomCode = await createRoom();
        const playerPromises = Array.from({ length: 7 }, () => connectPlayer(roomCode));
        const players = await Promise.all(playerPromises);

        let playersRejected = players.filter(p => p.readyState === WebSocket.CLOSED);
        expect(playersRejected.length).toBe(1);
        players.forEach((p) => p.close());
    });
});
