import { LoxoneUDPPacket } from "./LoxoneUDPPacket"

export class BufferPacket extends LoxoneUDPPacket {

  constructor(readonly buffer: Buffer) {
    super()
  }

  get controlByte() {
    return this.buffer.readUint8(0)
  }

  toBuffer() {
    return this.buffer
  }

}