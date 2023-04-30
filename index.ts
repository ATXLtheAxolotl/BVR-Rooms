import path from "path";
import fs from 'fs';

const filePath = path.resolve("./data/rooms.json");

function getStream() {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1 });
    return stream;
};

const stream = getStream();

let room: string;
let bricks: string;
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

            fs.writeFileSync(path.resolve(`${directory}/${room}.json`), JSON.stringify(JSON.parse(`[${split.join("")}]`), null, 2));

            bricks = "";
            bricks += data;
            break;
        case "[":
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
})