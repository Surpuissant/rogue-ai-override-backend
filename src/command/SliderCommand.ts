import { Command } from "./Command";
import { Logger } from "../utils/Logger";
import { Instruction } from "./board/Instruction";
import { CommandStyleType } from "./CommandStyleType";

// ! Attention, ce slider va de 1 en 1, pas de float !!!!!
// C'est donc un IntegerSlider !
export class SliderCommand extends Command {
    public status: string = "0";

    public constructor (name: string, id: string, public max: number, style_type: CommandStyleType) {
        super(name, id, style_type);
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
            "id": this.id,
            "name": this.name,
            "type": this.getType(),
            "styleType": this.getStyleType(),
            "actual_status": this.status,
            "action_possible": actions
        };
    }
}

