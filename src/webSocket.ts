import { WebSocket,WebSocketServer } from 'ws';
export class WebSocketStreamer {
    private wss: WebSocketServer
    private clients:Set<WebSocket>

    constructor(server:any) {
        this.wss = new WebSocketServer({server});
        this.clients = new Set();

        this.init()

    }
    init(): void {
        this.wss.on('connection', (ws) => {
            console.log(`Connection connected: ${ws}`);
            this.clients.add(ws);
        })
    }
    
    broadcast(message:string) {
        this.clients.forEach(client => client.send(message));
    }


}