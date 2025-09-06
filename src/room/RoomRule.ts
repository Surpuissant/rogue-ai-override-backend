import { ConstructorType } from "../utils/ConstructorType";
import CONFIG from "../Config";

export class RoomRule {
    public constructor(
        public readonly duration: number,
        public readonly onlyCommandType: ConstructorType | null,
        public readonly minPlayer: number = CONFIG.ROOM_MIN_PLAYERS,
        public readonly maxPlayer: number = CONFIG.ROOM_MAX_PLAYERS,
    ) { }
}