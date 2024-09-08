import { Payload } from "./Payload"

//@todo
export class SmartActuatorTunableWhitePayload extends Payload {

  get value() {
    return this.buffer
  }

  static bufferFromValue(data: Buffer) {
    const buffer = Buffer.alloc(8)
    data.copy(buffer, 0, 0, 8)
    return buffer
  }
}