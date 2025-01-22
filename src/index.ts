import * as http from "node:http";
import express, {Express} from 'express';
import {WebSocketStreamer} from "./webSocket";
import {LogWatcher} from "./logWatcher";

const app:Express = express()
const server = http.createServer(app);

const webSocketStreamer = new WebSocketStreamer(server)
const logfilePath = "/Users/tarun/Documents/my-space/log-watcher/log.txt";



const logWatcher = new LogWatcher(logfilePath,webSocketStreamer);


logWatcher.watch();
logWatcher.readNLines(10)
server.listen(8080, () => {
console.log("Listening on port 8080");
})