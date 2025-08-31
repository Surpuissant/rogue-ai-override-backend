import { Command } from "../Command";
import CONFIG from "../../Config";
import { CommandBoard } from "./CommandBoard";

export class Instruction {
    public timestampCreation: number;

    constructor(public command: Command, public expectedStatus: string, public text: string) {
        this.timestampCreation = Date.now();
    }

    public toObject(): Object {
        return {
            "command_id": this.command.id,
            "timeout": this.getTimeOut(),
            "timestampCreation": this.timestampCreation,
            "command_type": this.command.getType(),
            "instruction_text": this.text,
            "expected_status": this.expectedStatus
        }
    }

    public getTimeOut(): number {
        return CONFIG.INSTRUCTION_TIMEOUT;
    }

    public isComplete(): boolean {
        return this.command.status === this.expectedStatus;
    }
}