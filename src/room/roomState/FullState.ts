import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { PlayingState } from "./PlayingState";
import { ReadyState } from "./ReadyState";

export class FullState implements RoomState {
    getName() { return "full"; }

    addClient(room: Room, player: Player): boolean {
        return false;
    }

    removeClient(room: Room, player: Player): void {
        room.players = room.players.filter(p => p !== player);
        room.setState(new ReadyState());
    }

    startGame(room: Room): boolean {
        room.setState(new PlayingState(room));
        return true;
    }

    onPlayerReady(room: Room, player: Player): void {
        // Si le joueur ainsi que tout les autres sont ready, alors on peut lancé la partie
        var isEveryPlayerReady = room.players.every(p => p.ready);
        if(isEveryPlayerReady) {
            room.startGame();
        }
    }
}
