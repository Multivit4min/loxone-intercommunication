import { LoxoneRemoteSystem } from "../LoxoneRemoteSystem"
import { DATA_TYPE } from "./DataType"
import { LoxoneUDPPacket } from "./LoxoneUDPPacket"
import { AnalogPayload } from "./payload/AnalogPayload"
import { BufferPayload } from "./payload/BufferPayload"
import { DigitalPayload } from "./payload/DigitalPayload"
import { Payload } from "./payload/Payload"
import { TextPayload } from "./payload/TextPayload"

export class LoxoneIOPacket extends LoxoneUDPPacket {

  private _payload?: Payload

  constructor(readonly props: LoxoneIOPacket.Props) {
    super()
  }

  get controlByte() {
    return 0x9e
  }

  get sourceId() {
    return this.props.sourceId
  }

  get targetId() {
    return this.props.targetId
  }

  get packetId() {
    return this.props.packetId
  }

  get payloadLength() {
    return this.props.payloadLength || this.props.payload.byteLength
  }

  get type() {
    return this.props.type
  }

  private get payloadBuffer() {
    return this.props.payload
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
      default: return new BufferPayload(this.payloadBuffer)
    }
  }

  static fromBuffer(buffer: Buffer) {
    try {
      const payloadLength = buffer.readUint16LE(35)
      return new LoxoneIOPacket({
        sourceId: buffer.subarray(8, 16).toString("utf8").replace(/\x00/g, ""),
        targetId: buffer.subarray(17, 25).toString("utf8").replace(/\x00/g, ""),
        packetId: buffer.subarray(26, 34).toString("utf8").replace(/\x00/g, ""),
        payloadLength,
        type: buffer.readUInt8(37),
        payload: buffer.subarray(38, 38 + payloadLength)
      })
    } catch (e) {
      console.error("something bad happened")
      console.error(buffer)
      throw e
    }
  }

  static fromRemoteSystem(props: LoxoneIOPacket.CreateFromRemoteSystemProps) {
    const payload = LoxoneIOPacket.createPayloadBuffer(props)
    return new LoxoneIOPacket({
      sourceId: props.remoteSystem.ownId,
      targetId: props.remoteSystem.remoteId,
      packetId: props.packetId,
      type: props.type,
      payload
    })
  }

  static createPayloadBuffer({ type, value }: LoxoneIOPacket.PayloadDataType) {
    switch (type) {
      case DATA_TYPE.ANALOG: return AnalogPayload.bufferFromValue(value)
      case DATA_TYPE.DIGITAL: return DigitalPayload.bufferFromValue(value)
      case DATA_TYPE.TEXT: return TextPayload.bufferFromValue(value)
      default: throw new Error(`data type ${type} is not implemented`)
    }
  }

  static getTypeDataFromValue<T extends LoxoneIOPacket.TypeFromValue>(value: T): LoxoneIOPacket.PayloadDataType {
    switch(typeof value) {
      case "string": return { type: DATA_TYPE.TEXT, value }
      case "number": return { type: DATA_TYPE.ANALOG, value }
      case "boolean": return { type: DATA_TYPE.DIGITAL, value }
      default: throw new Error(`unknown value type: ${typeof value}`)
    }
  }

}

export namespace LoxoneIOPacket {

  export type Props = {
    sourceId: string
    targetId: string
    packetId: string
    payloadLength?: number
    type: DATA_TYPE
    payload: Buffer
  }

  export type CreateFromRemoteSystemProps = {
    remoteSystem: LoxoneRemoteSystem
    packetId: string
  } & PayloadDataType

  
  export type TypeFromValue = number|boolean|string

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
    value: any
  }

}