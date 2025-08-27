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

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.name = NAMES[Math.floor(Math.random() * NAMES.length)];
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
