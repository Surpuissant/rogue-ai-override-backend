import { Command } from "./Command";
import { Logger } from "../utils/Logger";
import { Instruction } from "./board/Instruction";
import {CommandStyleType} from "./CommandStyleType";

export class ToggleCommand extends Command {
    public status: string = "inactive";
    private isActive = () => this.status === "active";

    public constructor (name: string, id: string, private readonly style_type: CommandStyleType) {
        super(name, id);
    }

    public execute(action: string): void {
        switch (action) {
            case "toggle":
                this.status = this.isActive() ? "inactive" : "active";
                break;
            default:
                Logger.error(`Toggle command ${action} doesn't exist there`);
                break;
        }
        return
    }

    public getInstruction(): Instruction {
        return new Instruction(
            this,
            this.isActive() ? "inactive" : "active",
            this.isActive() ? `Désactivez le ${this.name}` : `Activez le ${this.name}`
        );
    }

    public getType(): string { return "toggle" }
    public getStyleType(): string { return this.style_type; }

    public toObject(): object {
        return {
            "id": this.id,
            "name": this.name,
            "type": this.getType(),
            "styleType": this.getStyleType(),
            "actual_status": this.status,
            "action_possible": ["toggle"]
        };
    }
}

