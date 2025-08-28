import { Instruction } from "./Instruction";

export abstract class Command {
    public abstract status: string;

    protected constructor(public name: string, public id: string) { }

    public abstract getType(): string;
    public abstract execute(action: string): void;
    public abstract getInstruction(): Instruction;
    public abstract toObject(): object;
}
