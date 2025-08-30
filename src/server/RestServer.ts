import express, { Application, Request, Response } from 'express';
import { RoomManager } from '../room/RoomManager';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { ToggleCommand } from "../command/ToggleCommand";
import { SliderCommand } from "../command/SliderCommand";

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
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               gameType:
         *                 type: string
         *                 enum: ["toggle", "slider"]
         *                 description: Optional command type for the room, enforce a type of Command and give only the given type
         *     responses:
         *       200:
         *         description: Room created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 roomCode:
         *                   type: string
         *                   description: The generated room code
         */
        this.app.post('/create-room', (req: Request, res: Response) => {
            const { gameType } = req.body || {};

            // Validation du gameType s'il est fourni
            if (gameType && !['toggle', 'slider'].includes(gameType)) {
                return res.status(400).json({
                    error: 'Invalid gameType. Must be either "toggle" or "slider"'
                });
            }

            let code: string;
            switch (gameType) {
                case 'toggle':
                    code = this.roomManager.createRoom(ToggleCommand);
                    break;
                case 'slider':
                    code = this.roomManager.createRoom(SliderCommand);
                    break;
                default:
                    code = this.roomManager.createRoom();
            }
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
