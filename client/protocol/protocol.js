import {
    StreamPeerBuffer as StreamPeerBufferClass
} from "./spb.js"
let exports = {};
(function() {
    let StreamPeerBuffer = StreamPeerBufferClass

    exports.encode = function(...stuff) {
        let buf = new StreamPeerBuffer();
        switch (stuff[0]) {
            case "input":
                buf.put_u8(0);
                buf.put_u8(stuff[1]);
                buf.put_u8(stuff[2]);
                buf.put_u8(stuff[3]);
                buf.put_u8(stuff[4]);
                buf.put_float(stuff[5]);
                buf.put_u8(stuff[6]);
                break;
            case "spawn":
                buf.put_u8(1);
                buf.put_utf8(stuff[1]);
                break;
            case "terminal":
                buf.put_u8(2);
                buf.put_utf8(stuff[1]);
                break;
            case "levelUp":
                buf.put_u8(3);
                break;
            case "livingAlert":
                buf.put_u8(4);
                break;
            case "skillUpgrade":
                buf.put_u8(5);
                buf.put_u8(stuff[1]);
                break;
            case "upgrade":
                buf.put_u8(6);
                buf.put_u8(stuff[1]);
                break;
        };
        return buf.buffer;
    };

    exports.decode = function(...stuff) {
        let buf = new StreamPeerBuffer();
        buf.set_data_array(...stuff)
        let type = buf.get_u8();
        let output = [];
        switch (type) {
            case 0:
                output.push("roomInfo");
                output.push(buf.get_u16()); // Width
                output.push(buf.get_u16()); // Height
                output.push(buf.get_utf8()); // Gamemode
                break;
            case 1:
                output.push("playerId");
                output.push(buf.get_u32());
                break;
            case 2: {
                output.push("entities");
                output.push({})
                let length = buf.get_u32();
                for (let i = 0; i < length; i++) { // the u32 we got is how many entities the server sent to us.
                    output[1][buf.get_u32()] = {
                        x: buf.get_32(),
                        y: buf.get_32(),
                        name: buf.get_utf8(),
                        facing: buf.get_float(),
                        size: buf.get_float(),
                        level: buf.get_u32(),
                        score: buf.get_u32(),
                        class: buf.get_u16(),
                        color: buf.get_u8(),
                        showName: buf.get_u8(),
                        showHealth: buf.get_u8(),
                        barrels: (() => {
                            let barrelsLength = buf.get_u16();
                            let barrels = [];
                            for (let i2 = 0; i2 < barrelsLength; i2++) {
                                barrels.push(buf.get_u8());
                            };
                            return barrels;
                        })(),
                        alpha: buf.get_u8() / 100,
                        vx: buf.get_float(),
                        vy: buf.get_float(),
                        health: buf.get_16() / 1000,
                        barrelFlash: buf.get_u8(),
                    };
                };
            }
            break;
        case 3:
            output.push("goingInGame");
            break;
        case 4:
            output.push("camera");
            output.push(buf.get_32());
            output.push(buf.get_32());
            output.push(buf.get_float());
            break;
        case 5:
            output.push("terminalOutput");
            output.push(buf.get_utf8());
            break;
        case 6:
            output.push("entityTypes");
            output.push(buf.get_utf8());
            break;
        case 7:
            output.push("death");
            output.push(buf.get_u16());
            break;
        case 8:
            output.push("message");
            output.push(buf.get_utf8());
            break;
        case 9:
            output.push("upgrade");
            output.push(buf.get_u16());
            break;
        case 10:
            output.push("upgradeReset");
            break;
        case 11:
            output.push("lb");
            let length = buf.get_u8();
            for (let i = 0; i < length; i++) {
                output.push({
                    id: buf.get_u32(),
                    score: buf.get_u32(),
                    name: buf.get_utf8(),
                    class: buf.get_u16(),
                    color: buf.get_u8(),
                });
            };
            break;
        case 12:
            output.push("kill");
            break;
        };
        return output;
    };
})();
export {
    exports as protocol
};