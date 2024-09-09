import dgram from "dgram"
import { EventEmitter } from "stream"
import { LoxoneUDPPacket } from "./packet/LoxoneUDPPacket"
import { LoxoneRemoteSystem } from "./LoxoneRemoteSystem"
import { LoxoneIOPacket } from "./packet/LoxoneIOPacket"
import { LoxoneInput } from "./packet/LoxoneInput"


export interface LoxoneServer extends EventEmitter {
  on(eventName: "data", listener: (props: LoxoneServer.DataEvent) => void): this
  
  emit(eventName: "data", props: LoxoneServer.DataEvent): boolean
}

export class LoxoneServer extends EventEmitter {

  readonly server = dgram.createSocket("udp4")

  constructor(readonly props: LoxoneServer.Props = {}) {
    super()
    this.server.on("message", (buffer, rinfo) => {
      const packet = LoxoneServer.packetFromBuffer(buffer)
      if (!packet) return
      this.emit("data", { rinfo, packet: packet })
    })
  }

  get ownId() {
    return this.props.ownId || ""
  }

  /**
   * creates a new remote system which sends inputs and
   * receives output from a loxone server
   * @param remoteId 
   * @returns 
   */
  createRemoteSystem(props: Omit<LoxoneRemoteSystem.Props, "server">) {
    return new LoxoneRemoteSystem({ ...props, server: this })
  }

  bind(port: number, address?: string) {
    return new Promise<void>(resolve => {
      this.server.bind(port, address, () => resolve())
    })
  }

  static packetFromBuffer(buffer: Buffer): LoxoneUDPPacket|void {
    const controlByte = buffer.readUInt8(0)
    switch (controlByte) {
      case 0x9e: return new LoxoneInput(buffer)
      case 0x8d: return console.log("control byte", new Date(), buffer) //what is this
      default: return console.log(new Date(), buffer)
    }
  }

}

export namespace LoxoneServer {

  export type Props = {
    //id of the server, leave empty if you want to listen to all incoming packets
    ownId?: string
  }

  export type DataEvent = {
    rinfo: dgram.RemoteInfo
    packet: LoxoneUDPPacket
  }
}