import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";

export class PlayingState implements RoomState {
    public constructor(public readonly room: Room) {
        room.broadcast({
            "type": "game_state",
            "payload": {
                "state": "game_start"
            }
        })
    }

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

    onPlayerReady(room: Room, player: Player): void {
        return
    }
}
