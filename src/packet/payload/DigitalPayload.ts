import { Payload } from "./Payload"

export class DigitalPayload extends Payload {

  get value(): DigitalPayload.Type {
    return Boolean(this.buffer.readUInt8(0))
  }

  static bufferFromValue(value: boolean) {
    const buffer = Buffer.alloc(1)
    buffer.writeUint8(value ? 1 : 0)
    return buffer
  }
}

export namespace DigitalPayload {
  export type Type = boolean
}