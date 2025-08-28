import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { CommandBoard } from "../../command/CommandBoard";

export class PlayingState implements RoomState {
    private threat: number = 0.3;
    public commandPlayer: Map<Player, CommandBoard> = new Map();

    public constructor(private room: Room) {
        room.broadcast({
            "type": "game_state",
            "payload": { "state": "game_start" }
        })
        room.players.forEach(player => {
            this.commandPlayer.set(player, CommandBoard.createCommandBoard())
        })
    }

    getName() { return "playing"; }

    addPlayer(player: Player): boolean {
        return false; // pas d’ajout en cours de partie
    }

    removePlayer(player: Player): void {
        this.room.players = this.room.players.filter(p => p !== player);
    }

    startGame(): boolean {
        return false;
    }

    onPlayerReady(player: Player): void {
        return
    }

    onPlayerMessage(player: Player, message: any): void {

    }
}
