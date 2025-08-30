import { Room, RoomRule } from './Room';
import { Player } from '../player/Player';
import { ConstructorType } from "../utils/ConstructorType";

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

    createRoom(onlyCommandType: ConstructorType | null = null): string {
        let code: string;
        do {
            code = Math.random().toString(36).slice(2, 8).toUpperCase();
        } while (this.rooms.has(code));

        this.rooms.set(code, new Room(code, new RoomRule(onlyCommandType)));
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
