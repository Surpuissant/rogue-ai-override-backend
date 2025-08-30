import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { WaitingState } from "./WaitingState";
import { PlayingState } from "./PlayingState";

export class TimerState implements RoomState {
    private timer?: NodeJS.Timeout;

    constructor(private room: Room, private duration: number = 3000) {
        room.broadcast({
            type: "game_state",
            payload: { state: "timer_before_start", duration: this.duration }
        });

        this.timer = setTimeout(() => {
            this.room.setState(new PlayingState(this.room));
        }, this.duration);
    }

    getName() {
        return "timer";
    }

    // Nobody can join during the timer
    addPlayer(player: Player): boolean {
        return false; // reject new connections
    }

    removePlayer(player: Player): void {
        // If someone leaves during the timer, cancel it and go back to WaitingState
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.room.setState(new WaitingState(this.room));
            this.room.broadcast({
                type: "game_state",
                payload: { state: "cancelled_due_to_leave" }
            });
        }
    }

    startGame(): boolean {
        this.room.setState(new PlayingState(this.room));
        return true;
    }

    onPlayerReady(player: Player): void {
        // Il ne se passe rien ici
    }

    onPlayerMessage(player: Player, message: any): void {

    }
}
