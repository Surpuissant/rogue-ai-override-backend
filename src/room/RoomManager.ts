import { Room } from './Room';
import WebSocket from 'ws';

export class RoomManager {
    private static instance: RoomManager; // singleton instance
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

    joinRoom(code: string, client: WebSocket): { success: boolean; error?: string } {
        const room = this.rooms.get(code);
        if (!room) return { success: false, error: 'Room inexistante' };

        const added = room.addClient(client);
        if (!added) return { success: false, error: 'Impossible de rejoindre la room (pleine ou état incorrect)' };

        return { success: true };
    }

    removeEmptyRooms() {
        for (const [code, room] of this.rooms.entries()) {
            if (room.getClientCount() === 0) {
                //this.rooms.delete(code);
            }
        }
    }

    getRoom(code: string): Room | undefined {
        return this.rooms.get(code);
    }
}
