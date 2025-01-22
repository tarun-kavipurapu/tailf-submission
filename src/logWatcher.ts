
/*
* This class handles watching responsibility of single file
* single object has responsibility of watching a single file
* */
import * as fs from "node:fs";
import {WatchEventType} from "fs";
import {WebSocketStreamer} from "./webSocket";
import {ReadStream} from "node:fs";

export  class LogWatcher {
    private logFilePath: string;
    private prevSize: number;
    private wss: WebSocketStreamer;
    // private queue:Array<[number,number]
    constructor(logFilePath: string,wss:WebSocketStreamer) {
        this.logFilePath = logFilePath;
        this.wss = wss
        this.prevSize = fs.statSync(logFilePath).size
        // this.queue = new Array<[number,number]>();
    }
    watch():void {
        fs.watch(this.logFilePath, (event:WatchEventType, filename:string|null) => {
            if(event=="change"){
                // console.log("Watch event:", event,filename);
                this.readNewLine()
            }
        })
    }
    readNewLine():void {

            const currSize:number = fs.statSync(this.logFilePath).size;
            if(this.prevSize < currSize){
               const stream:ReadStream =  fs.createReadStream(this.logFilePath,{start:this.prevSize, end:currSize ,encoding:"utf8"});
               stream.on("error", (err:Error) => {
                   console.error(err);
               })
                stream.on("end", () => {

                })
                stream.on("data", (chunk:string) => {
                    console.log(chunk);
                    // this.wss.broadcast(chunk);
                })
            }
            this.prevSize = currSize;
    }
    /*
    - logic is to start from end of the file and read every byte count "\n" backwards and break when it is >=n
    - reading every byte can be performance intensive may be i can read a chunk if needed
     */
    readNLines(n:number):void {
        let currSize:number = fs.statSync(this.logFilePath).size;
        let position:number = currSize;

        // const chunkSize:number = 1024
        let lineCount:number = 0;
        const fd =  fs.openSync(this.logFilePath,'r')

        while(position >0){
            const byte = Buffer.alloc(1);
            fs.readSync(fd,byte,0,1,position-1);
            position = (position - 1);

            const char = byte.toString("utf-8");

            if(char==='\n'){
                lineCount++;
            }
            if(lineCount>n){
                fs.closeSync(fd)
                break;
            }


        }
        const stream:ReadStream =  fs.createReadStream(this.logFilePath,{start:position, end:currSize ,encoding:"utf8"});
        stream.on("error", (err:Error) => {
            console.error(err);
        })
        stream.on("end", () => {

        })
        stream.on("data", (chunk:string) => {
            console.log(chunk);
        })


    }
}