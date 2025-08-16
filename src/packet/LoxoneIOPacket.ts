import { DATA_TYPE } from "./DataType"
import { LoxoneUDPPacket } from "./LoxoneUDPPacket"
import { Payload } from "./payload/Payload"

export abstract class LoxoneIOPacket extends LoxoneUDPPacket {

  get controlByte() {
    return 0x9e
  }

  abstract get packetId(): string
  abstract get payload(): Payload
  abstract get dataType(): DATA_TYPE

}
