import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";

export class PlayingState implements RoomState {
    getName() { return "playing"; }

    addClient(room: Room, player: Player): boolean {
        return false; // pas d’ajout en cours de partie
    }

    removeClient(room: Room, player: Player): void {
        room.players = room.players.filter(p => p !== player);
    }

    startGame(room: Room): boolean {
        return false;
    }
}
