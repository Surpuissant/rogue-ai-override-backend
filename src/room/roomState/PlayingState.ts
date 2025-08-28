import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { CommandBoard } from "../../command/CommandBoard";
import {Logger} from "../../utils/Logger";

export class PlayingState implements RoomState {
    private threat: number = 0.3;
    public commandPlayer: Map<Player, CommandBoard> = new Map();

    public constructor(private room: Room) {
        room.players.forEach(player => {
            this.commandPlayer.set(player, CommandBoard.createCommandBoard())
        })
        room.broadcast({
            "type": "game_state",
            "payload": {
                "state": "game_start",
                "start_threat": this.threat
            }
        })
        this.broadcastInfoToPlayer()
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
        if (message.type === "execute_action") {
            let commandBoard = this.commandPlayer.get(player)
            if (commandBoard === undefined) {
                Logger.error(`Command Board not found for player : ${player.id} `);
                return;
            }
            commandBoard!.execute(message.payload.command_id, message.payload.action)
        }
        this.broadcastInfoToPlayer()
    }

    broadcastInfoToPlayer(): void {
        this.commandPlayer.forEach((commandBoard, player) => {
            let raw_ws_message: Object = {
                "type": "player_board",
                "payload": {
                    "board": commandBoard.toObject(),
                    "instruction": commandBoard.instruction?.toObject(),
                    "threat": this.threat
                }
            }
            const message = JSON.stringify(raw_ws_message);
            player.ws.send(message);
        })
    }
}
