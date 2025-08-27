import { Player } from '../player/Player';
import { RoomState } from "./roomState/RoomState";
import { WaitingState } from "./roomState/WaitingState";

export class Room {
    private code: string;
    public players: Player[] = [];
    private state: RoomState;
    public readonly MIN_PLAYERS = 2;
    public readonly MAX_PLAYERS = 6;

    constructor(code: string) {
        this.code = code;
        this.state = new WaitingState();
    }

    getCode(): string {
        return this.code;
    }

    getPlayerCount(): number {
        return this.players.length;
    }

    getStateName(): string {
        return this.state.getName();
    }

    setState(state: RoomState) {
        this.state = state;
    }

    addPlayer(player: Player): boolean {
        return this.state.addClient(this, player); // Adapter les states pour Player
    }

    removePlayer(player: Player) {
        this.state.removeClient(this, player); // Adapter les states pour Player
    }

    broadcast(data: any) {
        const message = JSON.stringify(data);
        this.players.forEach(player => {
            if (player.ws && player.ws.readyState === 1) { // 1 = OPEN
                player.ws.send(message);
            }
        });
    }

    broadcastInfoOfAllPlayers() {
        this.broadcast({
            "type": "room_info",
            "payload": {
                "players": this.players.map(player => {
                    return { "name": player.name, "ready": player.ready }
                }),
                "room_state": this.getStateName()
            }
        });
    }

    onPlayerReady(player: Player): void {
        this.state.onPlayerReady(this, player);
    }

    startGame(): boolean {
        return this.state.startGame(this);
    }
}
