import WebSocket from "ws";
import {Room} from "../room/Room";

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
        // Déclenche l'évenement onPlayerMessage et après check le message
        this.room?.onPlayerMessage(this, data);

        try {
            // Process player message
            switch(data.type) {
                case 'room':
                    this.setReady(data.payload.ready)
                    break;
            }
        } catch (err) {
            console.error('Message parsing error:', err);
        }
    }
}
