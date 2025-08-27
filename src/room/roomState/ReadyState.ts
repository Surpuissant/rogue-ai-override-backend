import { RoomState } from "./RoomState";
import { Room } from "../Room";
import WebSocket from "ws";
import { WaitingState } from "./WaitingState";
import { FullState } from "./FullState";
import { PlayingState } from "./PlayingState";

export class ReadyState implements RoomState {
    getName() { return "ready"; }

    addClient(room: Room, client: WebSocket): boolean {
        if (room.getClientCount() >= room.MAX_PLAYERS) {
            return false;
        }
        room.clients.push(client);

        if (room.getClientCount() === room.MAX_PLAYERS) {
            room.setState(new FullState());
        }
        return true;
    }

    removeClient(room: Room, client: WebSocket): void {
        room.clients = room.clients.filter(c => c !== client);
        if (room.getClientCount() < room.MIN_PLAYERS) {
            room.setState(new WaitingState());
        }
    }

    startGame(room: Room): boolean {
        room.setState(new PlayingState());
        return true;
    }
}
