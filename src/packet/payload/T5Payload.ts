import { Payload } from "./Payload"

export class T5Payload extends Payload {

  get value(): T5Payload.ButtonPressed {
    return this.buffer.readUint16LE(6)
  }

  static bufferFromValue(button: T5Payload.ButtonPressed) {
    const buffer = Buffer.alloc(8)
    buffer.writeUint16LE(button, 6)
    return buffer
  }
}

export namespace T5Payload {

  export enum ButtonPressed {
    NONE = 0,
    MIDDLE = 16400,
    LEFT_UPPER = 16368,
    LEFT_LOWER = 16416,
    RIGHT_UPPER = 16384,
    RIGHT_LOWER = 16432
  }

}

/*
middle button press
00 00 00 00 00 00 10 40
4160

left upper press
00 00 00 00 00 00 f0 3f
61503

left bottom press
00 00 00 00 00 00 20 40
8256

right upper press
00 00 00 00 00 00 00 40
64

right lower press
00 00 00 00 00 00 30 40
12352

*/