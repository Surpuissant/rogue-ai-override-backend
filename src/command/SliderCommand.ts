import { Command } from "./Command";
import { Logger } from "../utils/Logger";
import { Instruction } from "./Instruction";

export class SliderCommand extends Command {
    public status: string = "0";

    public constructor (name: string, id: string, public max: number) {
        super(name, id);
    }

    public execute(action: string): void {
        const num = parseInt(action, 10);
        if (Number.isInteger(num) && num >= 0 && num <= this.max) {
            this.status = action;
        } else {
            Logger.warn(`Action "${action}" invalide pour ${this.name} (max=${this.max})`);
        }
    }

    public getInstruction(): Instruction {
        let expectedStatus: string;
        do {
            expectedStatus = Math.floor(Math.random() * (this.max + 1)).toString();
        } while (expectedStatus === this.status);

        return new Instruction(
            this,
            expectedStatus,
            `Mettez le ${this.name} à "${expectedStatus}"`
        );
    }

    public getType(): string { return "slider" }

    public toObject(): object {
        const actions: string[] = [];
        for (let i = 0; i <= this.max; i++) {
            if (i.toString() !== this.status) { // exclut l'état actuel
                actions.push(i.toString());
            }
        }

        return {
            id: this.id,
            name: this.name,
            type: this.getType(),
            actual_status: this.status,
            action_possible: actions
        };
    }
}

