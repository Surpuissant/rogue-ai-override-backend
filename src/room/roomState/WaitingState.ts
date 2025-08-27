import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { ReadyState } from "./ReadyState";

export class WaitingState implements RoomState {
    constructor(private room: Room){};

    getName() { return "waiting"; }

    addClient(player: Player): boolean {
        if (this.room.players.length >= this.room.MAX_PLAYERS) return false;
        this.room.players.push(player);

        if (this.room.getPlayerCount() >= this.room.MIN_PLAYERS) {
            this.room.setState(new ReadyState(this.room));
        }

        return true;
    }

    removeClient(player: Player): void {
        this.room.players = this.room.players.filter(p => p !== player);
    }

    startGame(): boolean {
        return false;
    }

    onPlayerReady(player: Player): void {
        // Il ne se passe rien si le joueur est ready dans le Waiting State
        return
    }
}
