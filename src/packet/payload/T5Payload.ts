import { Payload } from "./Payload"

export class T5Payload extends Payload {

  get value(): T5Payload.Type {
    return {
      button: this.buffer.readUint16LE(6)
    }
  }

  static bufferFromValue({ button }: T5Payload.Type) {
    const buffer = Buffer.alloc(8)
    buffer.writeUint16LE(button, 6)
    return buffer
  }
}

export namespace T5Payload {

  export type Type = {
    button: ButtonPressed
  }

  export enum ButtonPressed {
    NONE = 0,
    MIDDLE = 16400,
    LEFT_UPPER = 16368,
    LEFT_LOWER = 16416,
    RIGHT_UPPER = 16384,
    RIGHT_LOWER = 16432
  }

}