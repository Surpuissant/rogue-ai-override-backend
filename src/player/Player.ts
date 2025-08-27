import WebSocket from "ws";

export class Player {
    public ws: WebSocket;
    public ready: boolean = false;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    setReady(isReady: boolean) {
        this.ready = isReady;
    }

    isReady(): boolean {
        return this.ready;
    }
}
