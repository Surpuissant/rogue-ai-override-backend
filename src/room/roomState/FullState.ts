import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { PlayingState } from "./PlayingState";
import { ReadyState } from "./ReadyState";

export class FullState implements RoomState {
    constructor(private room: Room){};

    getName() { return "full"; }

    addClient(player: Player): boolean {
        return false;
    }

    removeClient(player: Player): void {
        this.room.players = this.room.players.filter(p => p !== player);
        this.room.setState(new ReadyState(this.room));
    }

    startGame(): boolean {
        this.room.setState(new PlayingState(this.room));
        return true;
    }

    onPlayerReady(player: Player): void {
        // Si le joueur ainsi que tout les autres sont ready, alors on peut lancé la partie
        var isEveryPlayerReady = this.room.players.every(p => p.ready);
        if(isEveryPlayerReady) {
            this.room.startGame();
        }
    }
}
