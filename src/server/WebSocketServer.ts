import WebSocket, { Server as WebSocketServerType } from 'ws';
import { RoomManager } from '../room/RoomManager';
import { Player } from '../player/Player';
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

            const player = new Player(ws);
            const { success, error } = RoomManager.getInstance().joinRoom(roomCode, player);

            if (!success) {
                ws.send(JSON.stringify({ error }));
                ws.close();
                return;
            }

            ws.on('close', () => {
                RoomManager.getInstance().removePlayer(player);
            });

            ws.on('error', (err) => {
                console.error('WS Error:', err);
            });

            // Exemple : recevoir un message pour ready
            ws.on('message', (data) => {
                try {
                    const msg = JSON.parse(data.toString());
                    if (msg.type === 'ready') {
                        player.setReady(!!msg.ready);
                    }
                } catch (err) {
                    console.error('Message parsing error:', err);
                }
            });
        });
    }
}
