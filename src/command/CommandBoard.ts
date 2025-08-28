import {Command, Instruction} from "./Command";
import {CommandFactory} from "./CommandFactory";

export class CommandBoard {
    public commands: Command[] = [];
    public instruction: Instruction | null = null;

    private constructor() {

    }

    public execute(commandId: string, action: string) {
        this.commands.forEach(command => {
                if (command.id === commandId) {
                    command.execute(action);
                }
            }
        );
    }

    public setInstruction(): void {
        const index = Math.floor(Math.random() * this.commands.length);
        this.instruction = this.commands[index].getInstruction();
    }

    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    public toObject(): Object {
        return {
            "commands": this.commands.map(command => command.toObject()),
        }
    }

    static createCommandBoard(){
        let commandBoard = new CommandBoard();

        // Actuellement, il n'y a que 4 commandes par board, déja bien !
        commandBoard.addCommand(CommandFactory.getRandomCommand())
        commandBoard.addCommand(CommandFactory.getRandomCommand())
        commandBoard.addCommand(CommandFactory.getRandomCommand())
        commandBoard.addCommand(CommandFactory.getRandomCommand())

        // Set l'instruction de cette manière, pour l'instant OK, après extends it
        commandBoard.setInstruction()

        return commandBoard;
    }
}