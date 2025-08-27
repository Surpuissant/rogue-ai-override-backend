import { RoomState } from "./RoomState";
import { Room } from "../Room";
import WebSocket from "ws";
import { PlayingState } from "./PlayingState";
import { ReadyState } from "./ReadyState";

export class FullState implements RoomState {
    getName() { return "full"; }

    addClient(room: Room, client: WebSocket): boolean {
        return false;
    }

    removeClient(room: Room, client: WebSocket): void {
        room.clients = room.clients.filter(c => c !== client);
        room.setState(new ReadyState());
    }

    startGame(room: Room): boolean {
        room.setState(new PlayingState());
        return true;
    }
}
