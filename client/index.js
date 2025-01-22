import express from 'express';
import path,{dirname} from "node:path";
import { fileURLToPath } from 'node:url';
const app    = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(5555,()=>{
    console.log("Started Client on port 5555");
});