import { EventEmitter } from "stream"
import { LoxoneServer } from "./LoxoneServer"
import { LoxoneIOPacket } from "./packet/LoxoneIOPacket"
import dgram, { Socket } from "dgram"

export class LoxoneRemoteSystem extends EventEmitter {

  private socket: Socket

  constructor(readonly props: LoxoneRemoteSystem.Props) {
    super()
    this.socket = dgram.createSocket("udp4")
    this.socket.connect(this.props.port, this.props.address)
  }

  get server() {
    return this.props.server
  }

  get ownId() {
    return this.server.ownId
  }

  get remoteId() {
    return this.props.remoteId
  }

  send(packetId: string, value: LoxoneRemoteSystem.SendValue) {
    const typeData = LoxoneIOPacket.getTypeDataFromValue(value)
    const packet = new LoxoneIOPacket({
      sourceId: this.ownId,
      targetId: this.remoteId,
      packetId,
      type: typeData.type,
      payload: LoxoneIOPacket.createPayloadBuffer(typeData)
    })
    this.sendBuffer(packet.toBuffer()) 
  }

  private sendBuffer(buffer: Buffer) {
    return this.socket.send(buffer)
  }


}

export namespace LoxoneRemoteSystem {
  export type Props = {
    //id of the remote loxone server which has been set inside Loxone Config under
    //MiniServer > Netowrk Intercommunication > Own ID
    remoteId: string
    //network address to reach the remote server
    address: string
    //network port to reach the remote server
    port: number
    server: LoxoneServer
  }

  export type SendValue = number|boolean|string
}