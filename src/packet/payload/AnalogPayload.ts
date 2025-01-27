import { Payload } from "./Payload"

export class AnalogPayload extends Payload {

  get value(): AnalogPayload.Type {
    return this.buffer.readDoubleLE(0)
  }

  static bufferFromValue(value: number) {
    const buffer = Buffer.alloc(8)
    buffer.writeDoubleLE(value)
    return buffer
  }

}

export namespace AnalogPayload {
  export type Type = number
}