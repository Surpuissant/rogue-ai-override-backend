import { Room } from './Room';
import WebSocket from 'ws';

export class RoomManager {
    private rooms: Map<string, Room> = new Map();

    createRoom(): string {
        let code: string;
        do {
            code = Math.random().toString(36).substr(2, 6).toUpperCase();
        } while (this.rooms.has(code));

        this.rooms.set(code, new Room(code));
        return code;
    }

    joinRoom(code: string, client: WebSocket): boolean {
        const room = this.rooms.get(code);
        if (!room) return false;

        room.addClient(client);
        return true;
    }

    removeEmptyRooms() {
        for (const [code, room] of this.rooms.entries()) {
            if (room.getClientCount() === 0) {
                this.rooms.delete(code);
            }
        }
    }
}
