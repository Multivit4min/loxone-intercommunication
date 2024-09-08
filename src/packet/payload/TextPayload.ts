import { Payload } from "./Payload"

export class TextPayload extends Payload {

  get value() {
    return this.buffer.toString("utf8", 0, this.byteLength - 1)
  }

  static bufferFromValue(value: string) {
    return Buffer.concat([Buffer.from(value, "utf8"), Buffer.from([0x00])])
  }

}