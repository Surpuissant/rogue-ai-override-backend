export class Config {
    public readonly ROOM_MIN_PLAYERS = 2;
    public readonly ROOM_MAX_PLAYERS = 6;
    public readonly INSTRUCTION_TIMEOUT = 15000
}

const CONFIG = new Config();

export default CONFIG