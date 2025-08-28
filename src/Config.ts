export class Config {
    constructor(
        public timeout: number
    ) { }
}

const CONFIG = new Config(15000);

export default CONFIG