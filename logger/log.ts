import * as fs from 'node:fs';

const logFilePath = '../log.txt';
const insertInFile = ()=>{
fs.appendFile(logFilePath,`Logged at ${new Date().toISOString()}\n`, (err) => {
    if (err) throw err;
})
}

console.log("Logged in...",logFilePath);
setInterval(()=>{
    insertInFile();
},1000)
