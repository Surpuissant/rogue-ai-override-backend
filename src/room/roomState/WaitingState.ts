import { RoomState } from "./RoomState";
import { Room } from "../Room";
import WebSocket from "ws";
import { ReadyState } from "./ReadyState";

export class WaitingState implements RoomState {
    getName() { return "waiting"; }

    addClient(room: Room, client: WebSocket): boolean {
        room.clients.push(client);
        if (room.getClientCount() >= room.MIN_PLAYERS) {
            room.setState(new ReadyState());
        }
        return true;
    }

    removeClient(room: Room, client: WebSocket): void {
        room.clients = room.clients.filter(c => c !== client);
    }

    startGame(room: Room): boolean {
        return false;
    }
}
