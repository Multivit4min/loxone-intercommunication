import { Payload } from "./Payload"

export class DigitalPayload extends Payload {

  get value() {
    return Boolean(this.buffer.readUInt8(0))
  }

}