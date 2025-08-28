import WebSocket from "ws";
import {Room} from "../room/Room";
import {Logger} from "../utils/Logger";

const NAMES = [
    "Coralie",
    "Damien",
    "Paul",
    "Ethan"
];

export class Player {
    public ws: WebSocket;
    public ready: boolean = false;
    public name: string;
    public room: Room | undefined;
    public id: string;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.name = NAMES[Math.floor(Math.random() * NAMES.length)];
        this.id = crypto.randomUUID();
    }

    setReady(isReady: boolean) {
        this.ready = isReady;
        this.room?.broadcastInfoOfAllPlayers();
        this.room?.onPlayerReady(this);
    }

    onMessage(data: any) {
        try {
            // Process player message
            switch(data.type) {
                case 'room':
                    this.setReady(data.payload.ready)
                    break;
                case 'execute_action':
                    this.room?.onPlayerMessage(this, data);
                    break;
                default:
                    Logger.warn(`Unknown type of message in Player on Message '${data.type}'`);
                    break;
            }
        } catch (err) {
            Logger.error('Message parsing error:' + err);
        }
    }

    public toObject(): object {
        return {
            "id": this.id,
            "name": this.name,
            "ready": this.ready
        }
    }
}
