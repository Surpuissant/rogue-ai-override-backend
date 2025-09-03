import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { ReadyState } from "./ReadyState";
import CONFIG from "../../Config";

export class WaitingState implements RoomState {
    constructor(private room: Room){
        room.broadcast({
            type: "game_state",
            payload: { state: "lobby_waiting" }
        });
    };

    getName() { return "waiting"; }

    addPlayer(player: Player): boolean {
        if (this.room.players.length >= this.room.roomRule.maxPlayer) return false;
        this.room.players.push(player);

        if (this.room.getPlayerCount() >= this.room.roomRule.minPlayer) {
            this.room.setState(new ReadyState(this.room));
        }

        return true;
    }

    removePlayer(player: Player): void {

    }

    startGame(): boolean {
        return false;
    }

    onPlayerReady(player: Player): void {
        // Il ne se passe rien si le joueur est ready dans le Waiting State
        return
    }

    onPlayerMessage(player: Player, message: any): void {

    }
}
