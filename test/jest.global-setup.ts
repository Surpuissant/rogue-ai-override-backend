import { Server } from "../src/server/Server";

let server: Server;

export default async function globalSetup(){
    const server = Server.getInstance(3000);
    server.start();
}