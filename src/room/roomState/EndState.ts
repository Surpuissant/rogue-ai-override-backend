import { RoomState } from "./RoomState";
import { Player } from "../../player/Player";
import { Room } from "../Room";

export class EndState implements RoomState {
    public constructor(private room: Room, private win: boolean) {
        room.broadcast({
            type: "game_state",
            payload: {
                state: "end_state",
                win: win
            }
        });
    }

    addPlayer(player: Player): boolean {
        return false;
    }

    getName(): string {
        return "end";
    }

    onPlayerMessage(player: Player, data: any): void {
    }

    onPlayerReady(player: Player): void {
    }

    removePlayer(player: Player): void {
    }

    startGame(): boolean {
        return false;
    }
}