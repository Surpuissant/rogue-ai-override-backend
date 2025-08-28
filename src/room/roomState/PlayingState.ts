import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { CommandBoard } from "../../command/CommandBoard";
import {Logger} from "../../utils/Logger";

export class PlayingState implements RoomState {
    private threat: number = 30;
    public commandPlayer: Map<Player, CommandBoard> = new Map();

    public constructor(private room: Room) {
        this.createCommandBoard()
        this.setRandomInstruction()
        room.broadcast({
            "type": "game_state",
            "payload": {
                "state": "game_start",
                "start_threat": this.threat
            }
        })
        this.broadcastInfoToPlayer()
    }

    public createCommandBoard(){
        this.room.players.forEach(player => {
            let commandBoard = CommandBoard.createCommandBoard()
            this.commandPlayer.set(player, commandBoard)
        })
    }

    public setRandomInstruction(): void {
        // Ici, je prends une commande random d'un autre board random et je recupère l'instruction
        this.commandPlayer.forEach(board => {
            this.updateRandomInstructionOnBoard(board)
        });
    }

    public updateRandomInstructionOnBoard(board: CommandBoard) : void {
        const others = Array.from(this.commandPlayer.values()).filter(b => b !== board);
        if (others.length === 0) return;
        const randomOther = others[Math.floor(Math.random() * others.length)];
        const index = Math.floor(Math.random() * randomOther.commands.length);
        let instruction = randomOther.commands[index].getInstruction();
        board.setInstruction(instruction)
    }

    getName() { return "playing"; }

    addPlayer(player: Player): boolean {
        return false; // pas d’ajout en cours de partie
    }

    removePlayer(player: Player): void {
        this.room.players = this.room.players.filter(p => p !== player);
    }

    startGame(): boolean { return false; }

    onPlayerReady(player: Player): void { return }

    onPlayerMessage(player: Player, message: any): void {
        if (message.type === "execute_action") {
            let commandBoard = this.commandPlayer.get(player)
            if (commandBoard === undefined) {
                Logger.error(`Command Board not found for player : ${player.id} `);
                return;
            }
            commandBoard!.execute(message.payload.command_id, message.payload.action)
            Logger.info(`Wanted to update command with the id : ${message.payload.command_id}`)
            let commandComplete = false;
            this.commandPlayer.forEach(board => {
                if(board.instruction?.isComplete()){
                    Logger.info("At least one command complete, threat is gonna down")
                    Logger.info(`Instruction is complete ! : command with the id : ${board.instruction?.command.id} and text : ${board.instruction?.text}`)
                    commandComplete = true
                    this.updateRandomInstructionOnBoard(board)
                } else {
                    Logger.info(`Instruction incomplete : ${board.instruction?.text}`)
                }
            })
            this.threat = commandComplete ? Math.max(0, this.threat - 5) : Math.min(100, this.threat + 5)
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
