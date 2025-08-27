import WebSocket from "ws";

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

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.name = NAMES[Math.floor(Math.random() * NAMES.length)];
    }

    setReady(isReady: boolean) {
        this.ready = isReady;
    }

    isReady(): boolean {
        return this.ready;
    }
}
