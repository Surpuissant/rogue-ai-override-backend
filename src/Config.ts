export class Config {
    public readonly ROOM_MIN_PLAYERS = 2;
    public readonly ROOM_MAX_PLAYERS = 6;
    public readonly STARTING_THREAT = 50;
    public readonly INSTRUCTION_TIMEOUT = 10000
    public readonly DEFAULT_GAME_DURATION = 45000
    public readonly GAME_LEVEL_INCREMENTAL_DURATION = 10000
}

const CONFIG = new Config();

export default CONFIG