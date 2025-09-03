import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { WaitingState } from "./WaitingState";
import { FullState } from "./FullState";
import { PlayingState } from "./PlayingState";
import { TimerState } from "./TimerState";
import CONFIG from "../../Config";

export class ReadyState implements RoomState {
    constructor(private room: Room){
        room.broadcast({
            type: "game_state",
            payload: { state: "lobby_ready" }
        });
    };

    getName() { return "ready"; }

    addPlayer(player: Player): boolean {
        if (this.room.players.length >= this.room.roomRule.maxPlayer) return false;
        this.room.players.push(player);
        if (this.room.players.length === this.room.roomRule.maxPlayer) {
            this.room.setState(new FullState(this.room));
        }
        return true;
    }

    removePlayer(player: Player): void {
        if (this.room.players.length < this.room.roomRule.minPlayer) {
            this.room.setState(new WaitingState(this.room));
        }
    }

    startGame(): boolean {
        this.room.setState(new PlayingState(this.room));
        return true;
    }

    onPlayerReady(player: Player): void {
        if(this.room.isEveryPlayerReady()) {
            this.room.setState(new TimerState(this.room))
        }
    }

    onPlayerMessage(player: Player, message: any): void {

    }
}
