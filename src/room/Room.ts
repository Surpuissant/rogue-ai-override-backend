import { Player } from '../player/Player';
import { RoomState } from "./roomState/RoomState";
import { WaitingState } from "./roomState/WaitingState";
import { Logger, TableInformation } from "../utils/Logger";
import { RoomRule } from "./RoomRule";

export class Room {
    private readonly code: string;
    public players: Player[] = [];
    public state: RoomState;

    constructor(code: string, public roomRule: RoomRule) {
        this.code = code;
        this.state = new WaitingState(this);
        this.logRoomInfo()
    }

    logRoomInfo(additionnalInfo: TableInformation | null = null): void {
        let headers = [
            "Code",
            "Durée (s)",
            "Type de commande autorisé",
            "Nb joueurs actuels",
            "Etat actuel"
        ];

        const contents = [
            this.code,
            this.roomRule.duration.toString(),
            this.roomRule.onlyCommandType
                ? this.roomRule.onlyCommandType.name
                : "aucune restriction",
            this.players.length.toString(),
            this.state.getName()
        ];

        if(additionnalInfo !== null) {
            headers.concat(additionnalInfo.headers)
            headers.concat(additionnalInfo.contents)
        }

        Logger.infoTable(headers, [contents])
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
        this.logRoomInfo({
            headers : ["Changement d'état (from)", "Changement d'état (to)"],
            contents: [this.state.getName(), state.getName()]
        })
        this.state = state;
    }

    addPlayer(player: Player): boolean {
        return this.state.addPlayer(player); // Adapter les states pour Player
    }

    removePlayer(player: Player) {
        this.players = this.players.filter(p => p !== player);
        this.state.removePlayer(player); // Adapter les states pour Player
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
        this.players.forEach(player => {
            const raw_ws_message = {
                "type": "room_info",
                "payload": {
                    "you": player.toObject(),
                    "players": this.players.map(p => p.toObject()),
                    "room_state": this.getStateName()
                }
            }
            const message = JSON.stringify(raw_ws_message);
            player.ws.send(message);
        })
    }

    onPlayerReady(player: Player): void {
        this.state.onPlayerReady(player);
    }

    onPlayerMessage(player: Player, message: any): void {
        this.state.onPlayerMessage(player, message);
    }

    startGame(): boolean {
        return this.state.startGame();
    }

    isEveryPlayerReady(): boolean {
        return this.players.every(p => p.ready);
    }
}
