let StreamPeerBuffer;
(function() {
StreamPeerBuffer = class {
  constructor() {
    this.view = new DataView(new ArrayBuffer(60000));
    this.offset = 0;
    this.read = 0;
    this.textEnc = new TextEncoder();
    this.textDec = new TextDecoder();
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
})();
export { StreamPeerBuffer }