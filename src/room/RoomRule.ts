import { ConstructorType } from "../utils/ConstructorType";

export class RoomRule {
    public constructor(
        public readonly duration: number,
        public readonly onlyCommandType: ConstructorType | null
    ) { }
}