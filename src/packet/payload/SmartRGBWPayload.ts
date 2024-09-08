import { Payload } from "./Payload"

export class SmartRGBWPayload extends Payload {

  get red() {
    return this.buffer.readUint8(0)
  }

  get green() {
    return this.buffer.readUint8(1)
  }

  get blue() {
    return this.buffer.readUint8(2)
  }

  get white() {
    return this.buffer.readUint8(3)
  }

  get fadeTime() {
    return this.buffer.readUint16LE(4)
  }

  get bits() {
    return this.buffer.readUint16LE(6)
  }

  get value(): SmartRGBWPayload.Type {
    return {
      red: this.red,
      green: this.green,
      blue: this.blue,
      white: this.white,
      fadeTime: this.fadeTime,
      bits: this.bits
    }
  }

  static bufferFromValue(data: SmartRGBWPayload.Type) {
    const buffer = Buffer.alloc(8)
    buffer.writeUint8(data.red, 0)
    buffer.writeUint8(data.green, 1)
    buffer.writeUint8(data.blue, 2)
    buffer.writeUint8(data.white, 3)
    buffer.writeUint16LE(data.fadeTime, 4)
    buffer.writeUint16LE(data.bits || 0, 6)
    return buffer
  }
}

export namespace SmartRGBWPayload {

  export type Type = {
    red: number
    green: number
    blue: number
    white: number
    fadeTime: number
    bits?: number
  }

}

/*
00 01 02 03 04 05 06 07
00 00 00 5a 02 00 00 00
R  G  B  W  FADE  BITS

Values 0x00-0x64

0: R
1: G
2: B
3: W
4: CHANGE TIME
5: CHANGE TIME
6: CONTROL BITS?
7: CONTROL BITS?
*/