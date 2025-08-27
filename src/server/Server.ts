import http from 'http';
import { RoomManager } from '../room/RoomManager';
import { RestServer } from './RestServer';
import { WebSocketServer } from './WebSocketServer';

export class Server {
    private static instance: Server;
    private port: number;
    public roomManager: RoomManager;
    public restServer: RestServer;
    public server: http.Server;

    private constructor(port: number = 3000) {
        this.port = port;
        this.roomManager = new RoomManager();
        this.restServer = new RestServer(this.roomManager);
        this.server = http.createServer(this.restServer.app);
        new WebSocketServer(this.server, this.roomManager);
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server(3000);
        }
        return Server.instance;
    }

    public start() {
        this.server.listen(this.port, () => {
            console.log(`Serveur démarré sur http://localhost:${this.port}`);
        });
    }
}
