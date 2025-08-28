import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { WaitingState } from "./WaitingState";
import { FullState } from "./FullState";
import { PlayingState } from "./PlayingState";
import {TimerState} from "./TimerState";

export class ReadyState implements RoomState {
    constructor(private room: Room){
        room.broadcast({
            type: "game_state",
            payload: { state: "lobby_ready" }
        });
    };

    getName() { return "ready"; }

    addPlayer(player: Player): boolean {
        if (this.room.players.length >= this.room.MAX_PLAYERS) return false;
        this.room.players.push(player);
        if (this.room.players.length === this.room.MAX_PLAYERS) {
            this.room.setState(new FullState(this.room));
        }
        return true;
    }

    removePlayer(player: Player): void {
        if (this.room.players.length < this.room.MIN_PLAYERS) {
            this.room.setState(new WaitingState(this.room));
        }
    }

    startGame(): boolean {
        this.room.setState(new PlayingState(this.room));
        return true;
    }

    onPlayerReady(player: Player): void {
        // Si le joueur ainsi que tout les autres sont ready, alors on peut lancé la partie
        var isEveryPlayerReady = this.room.players.every(p => p.ready);
        if(isEveryPlayerReady) {
            this.room.setState(new TimerState(this.room))
        }
    }

    onPlayerMessage(player: Player, message: any): void {

    }
}
