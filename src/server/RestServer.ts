import express, { Application, Request, Response } from 'express';
import { RoomManager } from '../room/RoomManager';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

export class RestServer {
    public app: Application;
    private roomManager: RoomManager;

    constructor(roomManager: RoomManager) {
        this.app = express();
        this.roomManager = roomManager;
        this.setupMiddlewares();
        this.setupDocs();
        this.setupRoutes();
    }

    private setupDocs() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Rogue AI Override - API Documentation',
                    version: '1.0.0',
                    description: "Rogue AI Override - API Documentation for Damien Dabernat's Android courses.",
                },
            },
            apis: ['./src/server/*.ts'],
        };

        const specs = swaggerJsdoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    private setupMiddlewares() {
        this.app.use(express.json());
    }

    private setupRoutes() {
        // Bon, un peu embêtant à lire ici mais pour le bien de la documentation
        // Swagger, plusieurs bigs commentaires ont été mis :/

        /**
         * @openapi
         * /health:
         *   get:
         *     summary: Check if the server is alive
         *     responses:
         *       200:
         *         description: Server is alive
         */
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ message: "Server is alive !" });
        });

        /**
         * @openapi
         * /create-room:
         *   post:
         *     summary: Create a new room
         *     responses:
         *       200:
         *         description: Room created successfully
         */
        this.app.post('/create-room', (req: Request, res: Response) => {
            const code = this.roomManager.createRoom();
            res.json({ roomCode: code });
        });

        /**
         * @openapi
         * /room-exists/{code}:
         *   get:
         *     summary: Check if a room exists
         *     parameters:
         *       - in: path
         *         name: code
         *         schema:
         *           type: string
         *         required: true
         *         description: The room code
         *     responses:
         *       200:
         *         description: Whether the room exists
         */
        this.app.get('/room-exists/:code', (req: Request, res: Response) => {
            const code = req.params.code;
            const exists = this.roomManager['rooms'].has(code);
            res.json({ exists });
        });
    }
}
