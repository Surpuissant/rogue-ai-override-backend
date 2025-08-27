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

    setRoom(room: Room) {
        this.room = room
    }

    setReady(isReady: boolean) {
        this.ready = isReady;
        this.room?.broadcastInfoOfAllPlayers();
        this.room?.onPlayerReady(this);
    }

    isReady(): boolean {
        return this.ready;
    }
}
