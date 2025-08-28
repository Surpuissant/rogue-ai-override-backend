import { Server } from "../src/server/Server";

let server: Server;

async function globalTeardown(){
    const server = Server.getInstance(3000);
    await server.server.close();
}