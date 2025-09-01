import {Command} from "./Command";
import {Logger} from "../utils/Logger";
import {Instruction} from "./board/Instruction";
import {CommandStyleType} from "./CommandStyleType";
import {CommandBoard} from "./board/CommandBoard";

export class ToggleCommand extends Command {
    public status: string = "inactive";
    private isActive = () => this.status === "active";

    public constructor (name: string, id: string, board: CommandBoard, private readonly style_type: CommandStyleType,
                        private customActiveLabel: string | undefined = undefined, private customInactiveLabel: string | undefined = undefined,
                        private customActiveInstruction: string | undefined = undefined, private customInactiveInstruction: string | undefined = undefined) {
        if(style_type === CommandStyleType.CUSTOM_BUTTON && (customActiveLabel === undefined || customInactiveLabel === undefined)) {
            throw new Error("Custom label required if style is CUSTOM");
        }
        super(name, id, style_type, board);
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
        let instructionPrompt = this.isActive() ? `Désactivez le ${this.name}` : `Activez le ${this.name}`
        if(this.customActiveInstruction !== undefined && this.customInactiveInstruction !== undefined) {
            instructionPrompt = this.isActive() ? this.customInactiveInstruction : this.customActiveInstruction
        }
        return new Instruction(
            this,
            this.isActive() ? "inactive" : "active",
            instructionPrompt
        );
    }

    public getType(): string { return "toggle" }

    public toObject(): object {
        return {
            "id": this.id,
            "name": this.name,
            "type": this.getType(),
            "styleType": this.getStyleType(),
            "label": this.getLabel(),
            "actual_status": this.status,
            "action_possible": ["toggle"]
        };
    }

    public getLabel(): string {
        switch (this.style_type) {
            case CommandStyleType.TOGGLE:
                return "Toggle";
            case CommandStyleType.ON_OFF_BUTTON:
                return this.isActive() ? "Activer" : "Désactiver";
            case CommandStyleType.CUSTOM_BUTTON:
                return this.isActive() ? this.customInactiveLabel! : this.customActiveLabel!;
            default:
                return ""
        }
    }
}

