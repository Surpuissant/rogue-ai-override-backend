import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { CommandBoard } from "../../command/CommandBoard";
import { Logger } from "../../utils/Logger";
import {TimerState} from "./TimerState";
import {EndState} from "./EndState";

export class PlayingState implements RoomState {
    private threat: number = 30;
    public commandPlayer: Map<Player, CommandBoard> = new Map();

    public constructor(private room: Room) {
        this.createCommandBoard();
        this.room.players.forEach(player => {
            const board = this.commandPlayer.get(player)!;
            this.updateRandomInstructionOnBoard(board);
            this.startInstructionRotation(board);
        });
        room.broadcast({
            type: "game_state",
            payload: {
                state: "game_start",
                start_threat: this.threat
            }
        });
        this.broadcastInfoToPlayer();
    }

    public createCommandBoard() {
        this.room.players.forEach(player => {
            const commandBoard =
                CommandBoard.createCommandBoard(Array.from(this.commandPlayer.values()));
            this.commandPlayer.set(player, commandBoard);
        });
    }

    private startInstructionRotation(board: CommandBoard) {
        if (board.instructionInterval) clearInterval(board.instructionInterval);
        board.instructionInterval = setInterval(() => {
            this.updateRandomInstructionOnBoard(board);
            this.broadcastInfoToPlayer()
            this.updateThreat(Math.min(100, this.threat + 5))
        }, 3000);
    }

    public setRandomInstruction(): void {
        this.commandPlayer.forEach(board => {
            this.updateRandomInstructionOnBoard(board);
        });
    }

    public updateRandomInstructionOnBoard(board: CommandBoard) {
        const others = Array.from(this.commandPlayer.values()).filter(b => b !== board);
        if (others.length === 0) return;

        const randomOther = others[Math.floor(Math.random() * others.length)];

        const availableCommands = randomOther.commands.filter(cmd => {
            const currentInstructionId = board.instruction?.command?.id;
            return cmd.getInstruction().command.id !== currentInstructionId;
        });

        if (availableCommands.length === 0) return;

        const index = Math.floor(Math.random() * availableCommands.length);
        const instruction = availableCommands[index].getInstruction();
        board.setInstruction(instruction);

        this.startInstructionRotation(board);
    }

    private broadcastBoard(board: CommandBoard) {
        const player = Array.from(this.commandPlayer.entries())
            .find(([_, b]) => b === board)?.[0];
        if (!player) return;
        const message = JSON.stringify({
            type: "player_board",
            payload: {
                board: board.toObject(),
                instruction: board.instruction?.toObject(),
                threat: this.threat
            }
        });
        player.ws.send(message);
    }

    broadcastInfoToPlayer(): void {
        this.commandPlayer.forEach((commandBoard, player) => {
            const message = JSON.stringify({
                type: "player_board",
                payload: {
                    board: commandBoard.toObject(),
                    instruction: commandBoard.instruction?.toObject(),
                    threat: this.threat
                }
            });
            player.ws.send(message);
        });
    }

    getName() { return "playing"; }

    addPlayer(player: Player): boolean { return false; }

    removePlayer(player: Player): void {
        this.room.players = this.room.players.filter(p => p !== player);
        const board = this.commandPlayer.get(player);
        if (board && board.instructionInterval) clearInterval(board.instructionInterval);
        this.commandPlayer.delete(player);
    }

    startGame(): boolean { return false; }

    onPlayerReady(player: Player): void { return }

    onPlayerMessage(player: Player, message: any): void {
        if (message.type === "execute_action") {
            const commandBoard = this.commandPlayer.get(player);
            if (!commandBoard) {
                Logger.error(`Command Board not found for player : ${player.id}`);
                return;
            }
            commandBoard.execute(message.payload.command_id, message.payload.action);
            let commandComplete = false;
            this.commandPlayer.forEach(board => {
                if (board.instruction?.isComplete()) {
                    commandComplete = true;
                    this.updateRandomInstructionOnBoard(board);
                }
            });
            this.updateThreat(commandComplete ? Math.max(0, this.threat - 5) : Math.min(100, this.threat + 5))
        }
        this.broadcastInfoToPlayer();
    }

    updateThreat(newThreat: number): void {
        this.threat = newThreat;
        if(this.threat === 100) this.endGame(false)
    }

    endGame(win: boolean = false): void {
        this.stopAllInstructionRotations()
        this.room.setState(new EndState(this.room, win))
    }

    stopAllInstructionRotations(): void {
        this.commandPlayer.forEach(board => {
            if (board.instructionInterval) clearInterval(board.instructionInterval);
        });
    }
}
