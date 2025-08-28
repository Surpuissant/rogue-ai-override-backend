import { Server } from "../src/server/Server";

let server: Server;

async function globalSetup(){
    const server = Server.getInstance(3000);
    server.start();
}