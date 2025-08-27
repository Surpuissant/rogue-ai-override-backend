import express, { Application, Request, Response } from 'express';
import { RoomManager } from '../room/RoomManager';

export class RestServer {
    public app: Application;
    private roomManager: RoomManager;

    constructor(roomManager: RoomManager) {
        this.app = express();
        this.roomManager = roomManager;
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
    }

    private setupRoutes() {
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ message: "Server is alive !" });
        });

        this.app.post('/create-room', (req: Request, res: Response) => {
            const code = this.roomManager.createRoom();
            res.json({ roomCode: code });
        });

        this.app.get('/room-exists/:code', (req: Request, res: Response) => {
            const code = req.params.code;
            const exists = this.roomManager['rooms'].has(code);
            res.json({ exists });
        });
    }
}
