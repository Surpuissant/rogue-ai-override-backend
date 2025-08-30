import { RoomState } from "./RoomState";
import { Room } from "../Room";
import { Player } from "../../player/Player";
import { CommandBoard } from "../../command/board/CommandBoard";
import { Logger } from "../../utils/Logger";
import { EndState } from "./EndState";
import CONFIG from "../../Config";

export interface TryAttempt {
    timestamp: number;
    success: boolean;
    playerId: string;
    playerName?: string;
}

// noinspection JSUnusedGlobalSymbols
export class PlayingState implements RoomState {
    private threat: number = CONFIG.STARTING_THREAT;
    public commandPlayer: Map<Player, CommandBoard> = new Map();
    private readonly gameStartTime: number;
    private tryHistory: TryAttempt[] = [];

    public constructor(private room: Room) {
        room.broadcast({
            type: "game_state",
            payload: {
                state: "game_start",
                start_threat: this.threat,
                game_duration: CONFIG.DEFAULT_GAME_DURATION,
                // TODO : Increase level on every retry
                level: 1
            }
        });
        room.players.forEach(player => { player.setReady(false) })
        this.gameStartTime = Date.now();
        this.createCommandBoard();
        this.room.players.forEach(player => {
            const board = this.commandPlayer.get(player)!;
            this.updateRandomInstructionOnBoard(board);
            this.startInstructionRotation(board);
        });
        this.broadcastInfoToPlayer();

        setTimeout(() => {
            if (this.threat < 100) {
                this.endGame(true);
            } else {
                this.endGame(false);
            }
        }, CONFIG.DEFAULT_GAME_DURATION);
    }

    public createCommandBoard() {
        this.room.players.forEach(player => {
            const commandBoard =
                CommandBoard.createCommandBoard(Array.from(this.commandPlayer.values()), this.room.roomRule.onlyCommandType);
            this.commandPlayer.set(player, commandBoard);
        });
    }

    private startInstructionRotation(board: CommandBoard) {
        if (board.instructionInterval) clearInterval(board.instructionInterval);
        board.instructionInterval = setInterval(() => {
            this.updateRandomInstructionOnBoard(board);
            this.broadcastInfoToPlayer()
            this.updateThreat(Math.min(100, this.threat + 5))
        }, CONFIG.INSTRUCTION_TIMEOUT);
    }

    public setRandomInstruction(): void {
        this.commandPlayer.forEach(board => {
            this.updateRandomInstructionOnBoard(board);
        });
    }

    public updateRandomInstructionOnBoard(board: CommandBoard) {
        let selectedBoard;
        if (Math.random() < 1/3) {
            selectedBoard = board;
        } else {
            const others = Array.from(this.commandPlayer.values()).filter(b => b !== board);
            if (others.length === 0) return;
            selectedBoard = others[Math.floor(Math.random() * others.length)];
        }

        const availableCommands = selectedBoard.commands.filter(cmd => {
            const currentInstructionId = board.instruction?.command?.id;
            return cmd.getInstruction().command.id !== currentInstructionId;
        });

        if (availableCommands.length === 0) return;

        const index = Math.floor(Math.random() * availableCommands.length);
        const instruction = availableCommands[index].getInstruction();
        board.setInstruction(instruction);
        this.startInstructionRotation(board);
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

    private addTryToHistory(player: Player, success: boolean): void {
        const currentTime = Date.now();
        const timeFromStart = currentTime - this.gameStartTime;

        this.tryHistory.push({
            timestamp: timeFromStart,
            success: success,
            playerId: player.id,
            playerName: player.name
        });
    }

    public getSuccessfulTries(): number {
        return this.tryHistory.filter(attempt => attempt.success).length;
    }

    public getBadTries(): number {
        return this.tryHistory.filter(attempt => !attempt.success).length;
    }

    public getTryHistory(): TryAttempt[] {
        return [...this.tryHistory];
    }

    public getFormattedTryHistory(): string {
        return this.tryHistory.map((attempt, index) => {
            const timeInSeconds = Math.round(attempt.timestamp / 1000);
            const result = attempt.success ? "RÉUSSI" : "ÉCHOUÉ";
            const playerInfo = attempt.playerName ? `${attempt.playerName} (${attempt.playerId})` : attempt.playerId;
            return `${index + 1}. ${timeInSeconds}s - ${result} - ${playerInfo}`;
        }).join('\n');
    }

    getName() { return "playing"; }

    addPlayer(player: Player): boolean { return false; }

    removePlayer(player: Player): void {
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
                    Logger.info(`Player : ${player.id} completed command`);
                    commandComplete = true;
                    this.updateRandomInstructionOnBoard(board);
                }
            });

            this.addTryToHistory(player, commandComplete);

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

        Logger.info(`Fin de partie - Historique des tentatives:\n${this.getFormattedTryHistory()}`);
        Logger.info(`Statistiques: ${this.getSuccessfulTries()} réussies, ${this.getBadTries()} échouées`);

        this.room.setState(new EndState(this.room, win, this.tryHistory))
    }

    stopAllInstructionRotations(): void {
        this.commandPlayer.forEach(board => {
            if (board.instructionInterval) clearInterval(board.instructionInterval);
        });
    }
}
