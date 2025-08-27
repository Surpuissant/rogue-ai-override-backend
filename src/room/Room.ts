import WebSocket from "ws";
import { RoomState } from "./roomState/RoomState";
import { WaitingState } from "./roomState/WaitingState";

export class Room {
    private code: string;
    public clients: WebSocket[] = [];
    private state: RoomState;
    public readonly MIN_PLAYERS = 2;
    public readonly MAX_PLAYERS = 6;

    constructor(code: string) {
        this.code = code;
        this.state = new WaitingState();
    }

    getCode(): string {
        return this.code;
    }

    getClientCount(): number {
        return this.clients.length;
    }

    getStateName(): string {
        return this.state.getName();
    }

    setState(state: RoomState) {
        this.state = state;
    }

    addClient(client: WebSocket): boolean {
        return this.state.addClient(this, client);
    }

    removeClient(client: WebSocket) {
        this.state.removeClient(this, client);
    }

    startGame(): boolean {
        return this.state.startGame(this);
    }
}
