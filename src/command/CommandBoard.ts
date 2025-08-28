import {Command} from "./Command";
import {ToggleCommand} from "./ToggleCommand";
import {CommandFactory} from "./CommandFactory";

export class CommandBoard {
    public commands: Command[] = [];

    private constructor() {

    }

    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    static createCommandBoard(){
        let commandBoard = new CommandBoard();

        // Actuellement, il n'y a que 4 commandes par board, déja bien !
        commandBoard.addCommand(CommandFactory.getRandomCommand())
        commandBoard.addCommand(CommandFactory.getRandomCommand())
        commandBoard.addCommand(CommandFactory.getRandomCommand())
        commandBoard.addCommand(CommandFactory.getRandomCommand())

        return commandBoard;
    }
}