import { RoomState } from "./RoomState";
import { Player } from "../../player/Player";
import { Room } from "../Room";
import { TryAttempt } from "./PlayingState";
import {ReadyState} from "./ReadyState";
import {WaitingState} from "./WaitingState";
import CONFIG from "../../Config";
import {FullState} from "./FullState";

export class EndState implements RoomState {
    public constructor(private room: Room, private win: boolean, tryHistory: TryAttempt[]) {
        room.broadcast({
            type: "game_state",
            payload: {
                state: "end_state",
                win: win,
                tryHistory: tryHistory.map(tryAttempt => {
                        return {
                            "time": tryAttempt.timestamp,
                            "player_id": tryAttempt.playerId,
                            "success": tryAttempt.success,
                        }
                    }
                )
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
        // Swap pour revenir à un state normal

        if(this.room.getPlayerCount() >= this.room.roomRule.maxPlayer) {
            this.room.setState(new FullState(this.room))
        } else if(this.room.getPlayerCount() >= this.room.roomRule.minPlayer){
            this.room.setState(new ReadyState(this.room))
        } else if(this.room.getPlayerCount() <= 1){
            this.room.setState(new WaitingState(this.room))
        }
    }

    removePlayer(player: Player): void {
    }

    startGame(): boolean {
        return false;
    }
}