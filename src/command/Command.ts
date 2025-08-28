import {CommandBoard} from "./CommandBoard";

export abstract class Command {
    public id: string;
    public abstract status: string;

    public constructor(public name: string) {
        this.id = crypto.randomUUID();
    }

    public abstract getType(): string;
    public abstract execute(action: string): void;
    public abstract getInstruction(): Instruction;
    public abstract toObject(): object;
}

export class Instruction {
    constructor(public command: Command, public expectedStatus: string, public text: string) { }

    public toObject(): Object {
        return {
            "command_id": this.command.id,
            "command_type": this.command.getType(),
            "instruction_text": this.text,
        }
    }

    public isComplete(): boolean {
        return this.command.status === this.expectedStatus;
    }
}