import { Room } from './Room';
import { Player } from '../player/Player';
import { ConstructorType } from "../utils/ConstructorType";
import CONFIG from "../Config";
import { RoomRule } from "./RoomRule";

export class RoomManager {
    private static instance: RoomManager;
    public rooms: Map<string, Room> = new Map();

    private constructor() {}

    public static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    createRoom(
        onlyCommandType: ConstructorType | null = null,
        gameDuration: number | null = null,
        soloGame: boolean = false,
    ): string {
        let code: string;
        do {
            code = Math.random().toString(36).slice(2, 8).toUpperCase();
        } while (this.rooms.has(code));

        let createdRoom: Room = new Room(code,
            new RoomRule(
                gameDuration === null ? CONFIG.DEFAULT_GAME_DURATION : gameDuration,
                onlyCommandType,
                soloGame ? 1 : CONFIG.ROOM_MIN_PLAYERS,
                soloGame ? 1 : CONFIG.ROOM_MAX_PLAYERS,
            )
        )

        this.rooms.set(code, createdRoom);
        return code;
    }

    joinRoom(code: string, player: Player): { success: boolean; error?: string } {
        const room = this.rooms.get(code);
        if (!room) return { success: false, error: 'Room inexistante' };

        const added = room.addPlayer(player);
        if (!added) return { success: false, error: 'Impossible de rejoindre la room (pleine ou état incorrect)' };

        player.room = room;
        return { success: true };
    }

    removePlayer(player: Player) {
        for (const room of this.rooms.values()) {
            const index = room.players.indexOf(player);
            if (index !== -1) {
                room.removePlayer(player);
                // Supprime la room si elle devient vide
                if (room.getPlayerCount() === 0) {
                    this.rooms.delete(room.getCode());
                }
                break;
            }
        }
    }

    getRoom(code: string): Room | undefined {
        return this.rooms.get(code);
    }
}
