import { Server } from './server/Server';

const server = Server.getInstance()

server.start();

export default server;