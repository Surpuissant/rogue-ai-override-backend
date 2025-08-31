import { Instruction } from "./board/Instruction";
import { CommandStyleType } from "./CommandStyleType";
import { CommandBoard } from "./board/CommandBoard";

export abstract class Command {
    public abstract status: string;

    protected constructor(
        public name: string,
        public id: string,
        private readonly styleType: CommandStyleType,
        public board: CommandBoard) { }

    public abstract getType(): string;
    public getStyleType(): string { return this.styleType; };
    public abstract execute(action: string): void;
    public abstract getInstruction(): Instruction;
    public abstract toObject(): object;
}