import { Command } from "../Command";
import CONFIG from "../../Config";

export class Instruction {
    public timeout: number = CONFIG.INSTRUCTION_TIMEOUT;
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
            "expected_status": this.expectedStatus
        }
    }

    public isComplete(): boolean {
        return this.command.status === this.expectedStatus;
    }
}