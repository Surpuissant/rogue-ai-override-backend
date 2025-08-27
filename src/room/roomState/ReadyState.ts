import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { WaitingState } from "./WaitingState";
import { FullState } from "./FullState";
import { PlayingState } from "./PlayingState";

export class ReadyState implements RoomState {
    getName() { return "ready"; }

    addClient(room: Room, player: Player): boolean {
        if (room.players.length >= room.MAX_PLAYERS) return false;
        room.players.push(player);
        if (room.players.length === room.MAX_PLAYERS) {
            room.setState(new FullState());
        }
        return true;
    }

    removeClient(room: Room, player: Player): void {
        room.players = room.players.filter(p => p !== player);
        if (room.players.length < room.MIN_PLAYERS) {
            room.setState(new WaitingState());
        }
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
