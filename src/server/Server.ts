import http from 'http';
import { RoomManager } from '../room/RoomManager';
import { RestServer } from './RestServer';
import { WebSocketServer } from './WebSocketServer';
import { Logger } from "../utils/Logger";

export class Server {
    private static instance: Server;

    private readonly port: number;

    public readonly roomManager: RoomManager;
    public readonly restServer: RestServer;
    public readonly server: http.Server;

    private constructor(port: number = 3000) {
        this.port = port;
        this.roomManager = RoomManager.getInstance();
        this.restServer = new RestServer(this.roomManager);
        this.server = http.createServer(this.restServer.app);
        new WebSocketServer(this.server);
    }

    public static getInstance(port: number = 3000): Server {
        if (!Server.instance) {
            Server.instance = new Server(port);
        }
        return Server.instance;
    }

    public start() {
        this.server.listen(this.port, () => {
            Logger.info(`Serveur démarré sur http://localhost:${this.port}`);
        });
    }
}
