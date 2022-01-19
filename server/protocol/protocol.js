let util = require("util");
let StreamPeerBuffer = class {
  constructor() {
    this.view = new DataView(new ArrayBuffer(60000));
    this.offset = 0;
    this.read = 0;
    this.textEnc = new util.TextEncoder();
    this.textDec = new util.TextDecoder();
  }
  get buffer() {
    var buf = this.view.buffer;
    var trimmer = new Uint8Array(buf);
    var trimmed = trimmer.slice(0, this.offset + this.read);
    return trimmed.buffer
  }
  put_u8(byte) {
    this.view.setUint8(this.offset, byte);
    this.offset++;
  }
  put_u16(dbyte) {
    this.view.setUint16(this.offset, dbyte);
    this.offset += 2;
  }
  put_u32(qbyte) {
    this.view.setUint32(this.offset, qbyte);
    this.offset += 4;
  }
  put_8(byte) {
    this.view.setInt8(this.offset, byte);
    this.offset++;
  }
  put_16(dbyte) {
    this.view.setInt16(this.offset, dbyte);
    this.offset += 2;
  }
  put_32(qbyte) {
    this.view.setInt32(this.offset, qbyte);
    this.offset += 4;
  }
  put_float(float) {
    this.view.setFloat32(this.offset, float)
    this.offset += 4;
  }
  put_utf8(str) {
    var bytes = this.textEnc.encode(str);
    this.put_u16(bytes.length)
    bytes.forEach(byte => {
      this.put_u8(byte)
    });
  }
  set_data_array(arrbuf) {
    this.offset = 0;
    this.view = new DataView(arrbuf);
    this.read = arrbuf.byteLength
  }
  get_u8() {
    var res = this.view.getUint8(this.offset);
    this.offset++;
    return res;
  }
  get_u16() {
    var res = this.view.getUint16(this.offset);
    this.offset += 2;
    return res;
  }
  get_u32() {
    var res = this.view.getUint32(this.offset);
    this.offset += 4;
    return res;
  }
  get_8() {
    var res = this.view.getInt8(this.offset);
    this.offset++;
    return res;
  }
  get_16() {
    var res = this.view.getInt16(this.offset);
    this.offset += 2;
    return res;
  }
  get_32() {
    var res = this.view.getInt32(this.offset);
    this.offset += 4;
    return res;
  }
  get_float() {
    var res = this.view.getFloat32(this.offset);
    this.offset += 4;
    return res;
  }
  get_utf8() {
    var length = this.get_u16();
    var arr = []
    for (var i = 0; i < length; i++) {
      arr.push(this.get_u8())
    }
    var buf = new Uint8Array(arr)
    return this.textDec.decode(buf)
  }
}

exports.encode = function (...stuff) {
  try {
  let buf = new StreamPeerBuffer();
  switch (stuff[0]) {
    case "roomInfo": // Room info
      buf.put_u8(0);
      buf.put_u16(stuff[1]);
      buf.put_u16(stuff[2]);
      buf.put_utf8(stuff[3]); // Gamemode
      break;
    case "playerId": // Player id
      buf.put_u8(1);
      buf.put_u32(stuff[1]);
      break;
    case "entities": // Entities
      buf.put_u8(2);
      buf.put_u32(Object.keys(stuff[1]).length)
      for (let key in stuff[1]) { // the u32 we got is how many entities the server sent to us.
        buf.put_u32(stuff[1][key].id);
        buf.put_32(stuff[1][key].x);
        buf.put_32(stuff[1][key].y);
        buf.put_utf8(stuff[1][key].name);
        buf.put_float(stuff[1][key].facing);
        buf.put_float(stuff[1][key].size);
        buf.put_u32(stuff[1][key].level);
        buf.put_u32(stuff[1][key].score);
        buf.put_u16(stuff[1][key].class);
        buf.put_u8(stuff[1][key].color);
        buf.put_u8(stuff[1][key].showName);
        buf.put_u8(stuff[1][key].showHealth);
        buf.put_u16(stuff[1][key].barrels.length);
        for (let i2 = 0; i2 < stuff[1][key].barrels.length; i2++) buf.put_u8(stuff[1][key].barrels[i2]);
        buf.put_u8(stuff[1][key].alpha * 100);
        buf.put_float(stuff[1][key].vx);
        buf.put_float(stuff[1][key].vy);
        buf.put_16(stuff[1][key].health * 1000);
        buf.put_u8(stuff[1][key].barrelFlash);
      };
      break;
    case "goingInGame":
      buf.put_u8(3);
      break;
    case "camera":
      buf.put_u8(4);
      buf.put_32(stuff[1]);
      buf.put_32(stuff[2]);
      buf.put_float(stuff[3]);
      break;
    case "terminalOutput":
      buf.put_u8(5);
      buf.put_utf8(stuff[1]);
      break;
    case "entityTypes":
      buf.put_u8(6);
      buf.put_utf8(stuff[1]);
      break;
    case "death":
      buf.put_u8(7);
      buf.put_u16(stuff[1]);
      break;
    case "message":
      buf.put_u8(8);
      buf.put_utf8(stuff[1]);
      break;
    case "upgrade":
      buf.put_u8(9);
      buf.put_u16(stuff[1]);
      break;
    case "upgradeReset":
      buf.put_u8(10);
      break;
    case "lb":
      buf.put_u8(11);
      buf.put_u8(stuff[1].length);
      for (let i = 0; i < stuff[1].length; i++) {
        let tank = stuff[1][i];
        buf.put_u32(tank.id);
        buf.put_u32(tank.score);
        buf.put_utf8(tank.name);
        buf.put_u16(tank.class);
        buf.put_u8(tank.color);
      };
      break;
    case "kill":
      buf.put_u8(12);
      break;
  };
  return buf.buffer;
  } catch(e) {};
};

exports.decode = function (...stuff) {
  try {
  let buf = new StreamPeerBuffer();
  buf.set_data_array(...stuff)
  let type = buf.get_u8();
  let output = []
  switch (type) {
    case 0: // Input
      output.push("input");
      for (let i = 0; i < 4; i++) output.push(buf.get_u8());
      output.push(buf.get_float());
      output.push(buf.get_u8());
      break;
    case 1: // Spawn
      output.push("spawn");
      output.push(buf.get_utf8());
      break;
    case 2: // Terminal
      output.push("terminal");
      output.push(buf.get_utf8());
      break;
    case 3: // levelup
      output.push("levelUp");
      break;
    case 4: // livingAlert, used for disconnection
      output.push("livingAlert");
      break;
    case 5: // Stat upgrading
      output.push("skillUpgrade");
      output.push(buf.get_u8());
      break;
    case 6: // upgrading
      output.push("upgrade");
      output.push(buf.get_u8());
      break;
    default:
      return ["unknown"];
  };
  return output;
  } catch (e) { return ["error"] }
};