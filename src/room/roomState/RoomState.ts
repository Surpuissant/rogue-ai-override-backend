import { Room } from "../Room";
import WebSocket from "ws";

export interface RoomState {
    addClient(room: Room, client: WebSocket): boolean;
    removeClient(room: Room, client: WebSocket): void;
    startGame(room: Room): boolean;
    getName(): string;
}
