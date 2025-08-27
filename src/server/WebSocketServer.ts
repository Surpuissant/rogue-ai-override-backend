import WebSocket, { Server as WebSocketServerType } from 'ws';
import { RoomManager } from '../room/RoomManager';
import http from 'http';

export class WebSocketServer {
    private wss: WebSocketServerType;
    private roomManager: RoomManager;

    constructor(server: http.Server, roomManager: RoomManager) {
        this.roomManager = roomManager;
        this.wss = new WebSocket.Server({ server });
        this.setupWebSocket();
    }

    private setupWebSocket() {
        this.wss.on('connection', (ws: WebSocket, req) => {
            const urlParams = new URLSearchParams(req.url?.split('?')[1]);
            const roomCode = urlParams.get('room');

            if (!roomCode) {
                ws.close();
                return;
            }

            const joined = this.roomManager.joinRoom(roomCode, ws);

            if (!joined) {
                ws.send(JSON.stringify({ error: 'Room inexistante' }));
                ws.close();
            }

            ws.on('close', () => {
                this.roomManager.removeEmptyRooms();
            });

            ws.on('error', (err) => {
                console.error('WS Error:', err);
            });
        });
    }
}
