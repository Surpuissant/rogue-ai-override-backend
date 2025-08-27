import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { ReadyState } from "./ReadyState";

export class WaitingState implements RoomState {
    getName() { return "waiting"; }

    addClient(room: Room, player: Player): boolean {
        if (room.players.length >= room.MAX_PLAYERS) return false;
        room.players.push(player);

        if (room.getPlayerCount() >= room.MIN_PLAYERS) {
            room.setState(new ReadyState());
        }

        return true;
    }

    removeClient(room: Room, player: Player): void {
        room.players = room.players.filter(p => p !== player);
    }

    startGame(room: Room): boolean {
        return false;
    }
}
