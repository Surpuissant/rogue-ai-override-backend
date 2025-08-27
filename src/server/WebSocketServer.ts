import WebSocket, { Server as WebSocketServerType } from 'ws';
import { RoomManager } from '../room/RoomManager';
import http from 'http';

export class WebSocketServer {
    private wss: WebSocketServerType;

    constructor(server: http.Server) {
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

            const { success, error } = RoomManager.getInstance().joinRoom(roomCode, ws);

            if (!success) {
                ws.send(JSON.stringify({ error }));
                ws.close();
                return;
            }

            ws.on('close', () => {
                RoomManager.getInstance().removeEmptyRooms();
            });

            ws.on('error', (err) => {
                console.error('WS Error:', err);
            });
        });
    }
}
