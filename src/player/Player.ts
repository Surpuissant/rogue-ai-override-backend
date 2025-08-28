import WebSocket from "ws";
import {Room} from "../room/Room";
import {Logger} from "../utils/Logger";

const NAMES = [
    "Nova",
    "Agent Zara",
    "Krix",
    "ByteMaster",
    "Agent Echo",
    "Vex_Hunter",
    "FluxRider",
    "Agent Nyx",
    "ZenWarrior",
    "RavenStrike",
    "Agent Blitz",
    "SageHacker",
    "StormBreaker",
    "Agent Cipher",
    "PhoenixRising",
    "RebelCode",
    "Agent Ghost",
    "TitanForce",
    "SparkFly",
    "Agent Vector",
    "PulseWave",
    "NexusPoint",
    "Agent Rogue",
    "OmegaLast",
    "PrismShard",
    "Agent Drift",
    "ShadowNet",
    "VertexCore",
    "Agent Chaos",
    "MatrixBender",
    "PixelNinja",
    "Agent Code",
    "NeonGhost",
    "CyberPunk",
    "Agent Phantom",
    "QuantumRush",
    "VirtualVibes",
    "Agent Samurai",
    "DigitalDemon",
    "Agent Shock"
];

export class Player {
    public ws: WebSocket;
    public ready: boolean = false;
    public name: string;
    public room: Room | undefined;
    public id: string;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.name = NAMES[Math.floor(Math.random() * NAMES.length)];
        this.id = crypto.randomUUID();
    }

    setReady(isReady: boolean) {
        this.ready = isReady;
        this.room?.broadcastInfoOfAllPlayers();
        this.room?.onPlayerReady(this);
    }

    onMessage(data: any) {
        try {
            // Process player message
            switch(data.type) {
                case 'room':
                    this.setReady(data.payload.ready)
                    break;
                case 'execute_action':
                    this.room?.onPlayerMessage(this, data);
                    break;
                default:
                    Logger.warn(`Unknown type of message in Player on Message '${data.type}'`);
                    break;
            }
        } catch (err) {
            Logger.error('Message parsing error:' + err);
        }
    }

    public toObject(): object {
        return {
            "id": this.id,
            "name": this.name,
            "ready": this.ready
        }
    }
}
