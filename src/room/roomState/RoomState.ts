import { Room } from "../Room";
import { Player } from "../../player/Player";

export interface RoomState {
    addPlayer(player: Player): boolean;
    removePlayer(player: Player): void;
    startGame(): boolean;
    getName(): string;
    onPlayerReady(player: Player): void;
    onPlayerMessage(player: Player, data: any): void;
}
