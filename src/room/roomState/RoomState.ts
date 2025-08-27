import { Room } from "../Room";
import { Player } from "../../player/Player";

export interface RoomState {
    addClient(room: Room, player: Player): boolean;
    removeClient(room: Room, player: Player): void;
    startGame(room: Room): boolean;
    getName(): string;
    onPlayerReady(room: Room, player: Player): void;
}
