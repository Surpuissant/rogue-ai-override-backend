import { Command } from "./Command";

export class Instruction {
    public timeout: number = 3000;
    public timestampCreation: number;

    constructor(public command: Command, public expectedStatus: string, public text: string) {
        this.timestampCreation = Date.now();
    }

    public toObject(): Object {
        return {
            "command_id": this.command.id,
            "timeout": this.timeout,
            "timestampCreation": this.timestampCreation,
            "command_type": this.command.getType(),
            "instruction_text": this.text,
        }
    }

    public isComplete(): boolean {
        return this.command.status === this.expectedStatus;
    }
}