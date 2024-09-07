import { Payload } from "./Payload"

export class TextPayload extends Payload {

  get value() {
    return this.buffer.toString("utf8", 0, this.byteLength - 1)
  }

}