import express from "express";
import path from "path";
import fs from 'fs';

const positionPath = __dirname + "/position";
if(!fs.existsSync(positionPath))
    fs.writeFileSync(positionPath, "0");

const startRead = Number(fs.readFileSync(positionPath, { encoding: "utf8" }));
const filePath = path.resolve("./data/rooms.json");
const start = isNaN(startRead) ? 0 : startRead;
const app = express();

function getStream() {
    return fs
        .createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1, start });
};

const stream = getStream();
let position: number = 0;
let bricks: string;
let room: string;

stream.on('data', (data) => {
    switch(data) {
        case " ":
            return;
        case "]":
            console.log(`Writing ${room}.json`);
            
            const directory = path.resolve(`./output/${room[0]}/${room[1]}/${room[2]}`);
            if (!fs.existsSync(directory))
                fs.mkdirSync(directory, { recursive: true });

            const split = bricks.split('[');
            split.shift();

            fs.writeFile(path.resolve(`${directory}/${room}.json`), JSON.stringify(JSON.parse(`[${split.join("")}]`), null, 2), () => {});

            bricks = "";
            bricks += data;
            break;
        case "[":
            fs.writeFileSync(__dirname + "/position", position.toString());
            room = "";

            for(let i = bricks.length - 3; i >= 0; i--) {
                if(isNaN(Number(bricks[i])))
                    break;

                room += bricks[i];
            }

            console.log()
            bricks += data;
            break;
        default:
            bricks += data;
    }

    position += data.length;
})

app.get("/", (_, res) => res.send(`${position} bytes`));