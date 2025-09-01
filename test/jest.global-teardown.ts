import { Server } from "../src/server/Server";

let server: Server;

export default async function globalTeardown(){
    const server = Server.getInstance(3000);
    server.server.close();
}