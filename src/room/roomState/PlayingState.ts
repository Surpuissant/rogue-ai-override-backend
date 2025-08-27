import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";

export class PlayingState implements RoomState {
    public constructor(private room: Room) {
        room.broadcast({
            "type": "game_state",
            "payload": {
                "state": "game_start"
            }
        })
    }

    getName() { return "playing"; }

    addClient(player: Player): boolean {
        return false; // pas d’ajout en cours de partie
    }

    removeClient(player: Player): void {
        this.room.players = this.room.players.filter(p => p !== player);
    }

    startGame(): boolean {
        return false;
    }

    onPlayerReady(player: Player): void {
        return
    }
}
