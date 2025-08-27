import { Room } from './Room';
import { Player } from '../player/Player';
import WebSocket from 'ws';

export class RoomManager {
    private static instance: RoomManager;
    private rooms: Map<string, Room> = new Map();

    private constructor() {}

    public static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    createRoom(): string {
        let code: string;
        do {
            code = Math.random().toString(36).substr(2, 6).toUpperCase();
        } while (this.rooms.has(code));

        this.rooms.set(code, new Room(code));
        return code;
    }

    joinRoom(code: string, player: Player): { success: boolean; error?: string } {
        const room = this.rooms.get(code);
        if (!room) return { success: false, error: 'Room inexistante' };

        const added = room.addPlayer(player);
        if (!added) return { success: false, error: 'Impossible de rejoindre la room (pleine ou état incorrect)' };

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
