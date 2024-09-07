import { Payload } from "./Payload"

export class BufferPayload extends Payload {

  get value() {
    return this.buffer
  }

}