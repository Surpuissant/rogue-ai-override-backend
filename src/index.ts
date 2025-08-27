import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { RoomManager } from './room/RoomManager';

const app = express();
const PORT = 3000;

app.use(express.json());

const roomManager = new RoomManager();

app.post('/create-room', (req, res) => {
    const code = roomManager.createRoom();
    res.json({ roomCode: code });
});

app.get('/room-exists/:code', (req, res) => {
    const code = req.params.code;
    const exists = roomManager['rooms'].has(code);
    res.json({ exists });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const roomCode = urlParams.get('room');

    if (!roomCode) {
        ws.close();
        return;
    }

    const joined = roomManager.joinRoom(roomCode, ws);

    if (!joined) {
        ws.send(JSON.stringify({ error: 'Room inexistante' }));
        ws.close();
    }

    ws.on('close', () => {
        roomManager.removeEmptyRooms();
    });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
