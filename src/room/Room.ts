import WebSocket from 'ws';

export class Room {
    public code: string;
    private clients: Set<WebSocket> = new Set();

    constructor(code: string) {
        this.code = code;
    }

    addClient(client: WebSocket) {
        this.clients.add(client);
        client.send(JSON.stringify({ message: `Bienvenue dans la room ${this.code}` }));

        client.on('close', () => {
            this.removeClient(client);
        });

        client.on('message', (data) => {
            this.broadcast(data.toString(), client);
        });
    }

    removeClient(client: WebSocket) {
        this.clients.delete(client);
    }

    broadcast(message: string, sender?: WebSocket) {
        for (const client of this.clients) {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message }));
            }
        }
    }

    getClientCount() {
        return this.clients.size;
    }
}
