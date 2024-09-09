import { DATA_TYPE } from "./DataType"
import { LoxoneIOPacket } from "./LoxoneIOPacket"
import { AnalogPayload } from "./payload/AnalogPayload"
import { BufferPayload } from "./payload/BufferPayload"
import { DigitalPayload } from "./payload/DigitalPayload"
import { Payload } from "./payload/Payload"
import { SmartActuatorSingleChannelPayload } from "./payload/SmartActuatorSingleChannelPayload"
import { SmartActuatorTunableWhitePayload } from "./payload/SmartActuatorTunableWhitePayload"
import { SmartRGBWPayload } from "./payload/SmartRGBWPayload"
import { T5Payload } from "./payload/T5Payload"
import { TextPayload } from "./payload/TextPayload"

export class LoxoneInput extends LoxoneIOPacket {

  private _payload?: Payload

  constructor(readonly buffer: Buffer) {
    super()
  }

  get sourceId() {
    return this.buffer.subarray(8, 16).toString("utf8").replace(/\x00/g, "")
  }

  get targetId() {
    return this.buffer.subarray(17, 25).toString("utf8").replace(/\x00/g, "")
  }

  get packetId() {
    return this.buffer.subarray(26, 34).toString("utf8").replace(/\x00/g, "")
  }

  get payloadLength() {
    return this.buffer.readUint16LE(35)
  }

  get type() {
    return this.buffer.readUInt8(37)
  }

  private get payloadBuffer() {
    return this.buffer.subarray(38, 38 + this.payloadLength)
  }

  get payload() {
    if (!this._payload) this._payload = this.createPayload()
    return this._payload
  }

  toBuffer() {
    const buffer = Buffer.alloc(38)
    buffer.writeUint8(0x9e)
    Buffer.from(this.sourceId, "utf8").copy(buffer, 8, 0, 8)
    Buffer.from(this.targetId, "utf8").copy(buffer, 17, 0, 8)
    Buffer.from(this.packetId, "utf8").copy(buffer, 26, 0, 8)
    buffer.writeUint8(this.payloadLength, 35)
    buffer.writeUint8(this.type, 37)
    return Buffer.concat([buffer, this.payloadBuffer])
  }

  private createPayload() {
    switch (this.type) {
      case DATA_TYPE.ANALOG: return new AnalogPayload(this.payloadBuffer)
      case DATA_TYPE.DIGITAL: return new DigitalPayload(this.payloadBuffer)
      case DATA_TYPE.TEXT: return new TextPayload(this.payloadBuffer)
      case DATA_TYPE.T5: return new T5Payload(this.payloadBuffer)
      case DATA_TYPE.SmartActuatorRGBW: return new SmartRGBWPayload(this.payloadBuffer)
      case DATA_TYPE.SmartActuatorSingleChannel: return new SmartActuatorSingleChannelPayload(this.payloadBuffer)
      case DATA_TYPE.SmartActuatorTunableWhite: return new SmartActuatorTunableWhitePayload(this.payloadBuffer)
      default: return new BufferPayload(this.payloadBuffer)
    }
  }

}