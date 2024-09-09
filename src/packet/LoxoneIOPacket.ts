import { LoxoneUDPPacket } from "./LoxoneUDPPacket"

export class LoxoneIOPacket extends LoxoneUDPPacket {

  get controlByte() {
    return 0x9e
  }

}
