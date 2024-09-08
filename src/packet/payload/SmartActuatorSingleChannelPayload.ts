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

/*
00 01 02 03 04 05 06 07
00 00 00 5a 02 00 00 00
R  G  B  W  FADE  BITS

Values 0x00-0x64

0: R
1: G
2: B
3: W
4: CHANGE TIME
5: CHANGE TIME
6: CONTROL BITS?
7: CONTROL BITS?
*/