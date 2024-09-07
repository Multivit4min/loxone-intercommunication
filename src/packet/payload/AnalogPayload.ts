import { Payload } from "./Payload"

export class AnalogPayload extends Payload {

  get value() {
    return this.buffer.readDoubleLE(0)
  }

}