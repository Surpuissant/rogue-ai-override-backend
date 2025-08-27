import { Room } from "../Room";
import { Player } from "../../player/Player";

export interface RoomState {
    addClient(player: Player): boolean;
    removeClient(player: Player): void;
    startGame(): boolean;
    getName(): string;
    onPlayerReady(player: Player): void;
}
