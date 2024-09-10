import { Payload } from "./Payload"

export class SmartActuatorSingleChannelPayload extends Payload {

  get channel() {
    return this.buffer.readUint8(3)
  }

  get fadeTime() {
    return this.buffer.readUint16LE(4)
  }

  get value(): SmartActuatorSingleChannelPayload.Type {
    return {
      channel: this.channel,
      fadeTime: this.fadeTime
    }
  }

  static bufferFromValue(data: SmartActuatorSingleChannelPayload.Type) {
    const buffer = Buffer.alloc(8)
    buffer.writeUint8(data.channel, 3)
    buffer.writeUint16LE(data.fadeTime, 4)
    return buffer
  }
}

export namespace SmartActuatorSingleChannelPayload {

  export type Type = {
    channel: number
    fadeTime: number
  }

}