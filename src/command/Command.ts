export abstract class Command {
    public id: string;

    public constructor(public name: string) {
        this.id = crypto.randomUUID();
    }

    public abstract execute(action: string): void;
    public abstract toObject(): object;
}