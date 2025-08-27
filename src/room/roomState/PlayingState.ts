import { RoomState } from "./RoomState";
import { Room } from "../Room";
import WebSocket from "ws";

export class PlayingState implements RoomState {
    getName() { return "playing"; }

    addClient(room: Room, client: WebSocket): boolean {
        return false; // pas d’ajout en cours de partie
    }

    removeClient(room: Room, client: WebSocket): void {
        room.clients = room.clients.filter(c => c !== client);
    }

    startGame(room: Room): boolean {
        return false;
    }
}
