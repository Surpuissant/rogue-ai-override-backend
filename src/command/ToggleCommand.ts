import {Command} from "./Command";
import {Logger} from "../utils/Logger";

export class ToggleCommand extends Command {
    public isActive: boolean = false;

    public constructor (name: string) {
        super(name);
    }

    public execute(action: string): void {
        switch (action) {
            case "toggle":
                this.isActive = !(this.isActive);
                break;
            default:
                Logger.error(`Toggle command ${action} doesn't exist there`);
                break;
        }
        return
    }

    public toObject(): object {
        return {
            "id": this.id,
            "name": this.name,
            "type": "toggle",
            "actual_status": this.isActive ? "active" : "inactive",
            "action_possible": ["toggle"]
        };
    }
}

