import { Command } from "../Command";
import { CommandFactory } from "../factory/CommandFactory";
import { Instruction } from "./Instruction";
import { ConstructorType } from "../../utils/ConstructorType";
import { Room } from "../../room/Room";

export class CommandBoard {
    public commands: Command[] = [];
    public instruction: Instruction | null = null;
    public instructionInterval?: NodeJS.Timeout;

    public constructor(public room: Room) { }

    public execute(commandId: string, action: string) {
        this.commands.forEach(command => {
                if (command.id === commandId) {
                    command.execute(action);
                }
            }
        );
    }

    public setInstruction(instruction: Instruction): void {
        this.instruction = instruction;
    }

    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    public toObject(): Object {
        return {
            "commands": this.commands.map(command => command.toObject()),
        }
    }

    static createCommandBoard(room: Room, otherBoards: CommandBoard[], onlyCommandType: ConstructorType | null) {
        const commandBoard = new CommandBoard(room);
        const existingIds = new Set<string>();

        otherBoards.forEach(board => {
            board.commands.forEach(cmd => existingIds.add(cmd.id));
        });

        for (let i = 0; i < 4; i++) {
            const command = CommandFactory.getRandomCommand(Array.from(existingIds), commandBoard, onlyCommandType);
            commandBoard.addCommand(command);
            existingIds.add(command.id);
        }

        return commandBoard;
    }

}