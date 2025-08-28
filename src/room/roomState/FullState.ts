import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { PlayingState } from "./PlayingState";
import { ReadyState } from "./ReadyState";

export class FullState implements RoomState {
    constructor(private room: Room){
        room.broadcast({
            type: "game_state",
            payload: { state: "lobby_full" }
        });
    };

    getName() { return "full"; }

    addPlayer(player: Player): boolean {
        return false;
    }

    removePlayer(player: Player): void {
        this.room.setState(new ReadyState(this.room));
    }

    startGame(): boolean {
        this.room.setState(new PlayingState(this.room));
        return true;
    }

    onPlayerReady(player: Player): void {
        if(this.room.isEveryPlayerReady()) {
            this.room.startGame();
        }
    }

    onPlayerMessage(player: Player, message: any): void {

    }
}
