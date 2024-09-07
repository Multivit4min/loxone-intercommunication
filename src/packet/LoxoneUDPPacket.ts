import { AnalogPayload } from "./payload/AnalogPayload"
import { BufferPayload } from "./payload/BufferPayload"
import { DigitalPayload } from "./payload/DigitalPayload"
import { Payload } from "./payload/Payload"
import { TextPayload } from "./payload/TextPayload"

export class LoxoneUDPPacket {

  private _payload?: Payload

  constructor(readonly buffer: Buffer) {}

  get sourceId() {
    return this.buffer.subarray(8, 16).toString("utf8").replace(/\x00/g, "")
  }

  get targetId() {
    return this.buffer.subarray(17, 24).toString("utf8").replace(/\x00/g, "")
  }

  get packetId() {
    return this.buffer.subarray(26, 33).toString("utf8").replace(/\x00/g, "")
  }

  get payloadLength() {
    return this.buffer.readUint16LE(35)
  }

  get type() {
    return this.buffer.readUInt8(37)
  }

  private get payloadBuffer() {
    return this.buffer.subarray(38)
  }

  private createPayload() {
    switch (this.type) {
      case DATA_TYPE.ANALOG: return new AnalogPayload(this.payloadBuffer)
      case DATA_TYPE.DIGITAL: return new DigitalPayload(this.payloadBuffer)
      case DATA_TYPE.TEXT: return new TextPayload(this.payloadBuffer)
      default: return new BufferPayload(this.payloadBuffer)
    }
  }

  get payload() {
    if (!this._payload) this._payload = this.createPayload()
    return this._payload
  }

}

export enum DATA_TYPE {
  DIGITAL = 0x00,
  ANALOG = 0x01,
  TEXT = 0x02,
  T5 = 0x03
  //Smart Actuator RGBW
  //Smart Actuator Single Channel
  //Smart Actuator Tunable White
}