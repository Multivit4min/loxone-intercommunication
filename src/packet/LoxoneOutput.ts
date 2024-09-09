import { LoxoneRemoteSystem } from "../LoxoneRemoteSystem"
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

export class LoxoneOutput extends LoxoneIOPacket {

  private _payload?: Payload
  sourceId: string
  targetId: string
  packetId: string
  type: DATA_TYPE
  payloadBuffer: Buffer

  constructor(readonly props: LoxoneOutput.Props) {
    super()
    this.payloadBuffer = LoxoneOutput.createPayloadBuffer(props)
    this.sourceId = props.remoteSystem.ownId
    this.targetId = props.remoteSystem.remoteId
    this.packetId = props.packetId
    this.type = props.type
}

  get payloadLength() {
    return this.payloadBuffer.byteLength
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

  static createPayloadBuffer({ type, value }: LoxoneOutput.PayloadDataType) {
    switch (type) {
      case DATA_TYPE.ANALOG: return AnalogPayload.bufferFromValue(value)
      case DATA_TYPE.DIGITAL: return DigitalPayload.bufferFromValue(value)
      case DATA_TYPE.TEXT: return TextPayload.bufferFromValue(value)
      case DATA_TYPE.T5: return T5Payload.bufferFromValue(value)
      case DATA_TYPE.SmartActuatorRGBW: return SmartRGBWPayload.bufferFromValue(value)
      case DATA_TYPE.SmartActuatorSingleChannel: return SmartActuatorSingleChannelPayload.bufferFromValue(value)
      case DATA_TYPE.SmartActuatorTunableWhite: return SmartActuatorTunableWhitePayload.bufferFromValue(value)
      default: throw new Error(`data type ${type} is not implemented`)
    }
  }

  static getTypeDataFromValue(value: LoxoneOutput.TypeFromValue): LoxoneOutput.PayloadDataType {
    switch(typeof value) {
      case "string": return { type: DATA_TYPE.TEXT, value }
      case "number": return { type: DATA_TYPE.ANALOG, value }
      case "boolean": return { type: DATA_TYPE.DIGITAL, value }
      case "object":
        const v = <any>value
        if (v instanceof Buffer) {
          return { type: DATA_TYPE.SmartActuatorTunableWhite, value: v }
        } else if (!isNaN(v["button"])) {
          return { type: DATA_TYPE.T5, value: v }
        } else if (!isNaN(v["red"]) && !isNaN(v["green"]) && !isNaN(v["blue"]) && !isNaN(v["white"])) {
          return { type: DATA_TYPE.SmartActuatorRGBW, value: v }
        } else if (v["channel"]) {
          return { type: DATA_TYPE.SmartActuatorSingleChannel, value: v }
        }
      default: throw new Error(`unknown value type: ${typeof value}`)
    }
  }

}

export namespace LoxoneOutput {

  export type Props = {
    remoteSystem: LoxoneRemoteSystem
    packetId: string
  } & PayloadDataType

  
  export type TypeFromValue = 
    number |
    boolean |
    string |
    T5Payload.Type |
    SmartRGBWPayload.Type |
    SmartActuatorSingleChannelPayload.Type |
    Buffer

  export type PayloadDataType = {
    type: DATA_TYPE.ANALOG
    value: number
  } | {
    type: DATA_TYPE.DIGITAL
    value: boolean
  } | {
    type: DATA_TYPE.TEXT
    value: string
  } | {
    type: DATA_TYPE.T5
    value: T5Payload.Type
  } | {
    type: DATA_TYPE.SmartActuatorRGBW
    value: SmartRGBWPayload.Type
  } | {
    type: DATA_TYPE.SmartActuatorSingleChannel
    value: SmartActuatorSingleChannelPayload.Type
  } | {
    type: DATA_TYPE.SmartActuatorTunableWhite
    value: Buffer
  }

}