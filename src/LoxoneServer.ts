import dgram from "dgram"
import { EventEmitter } from "stream"
import { LoxoneUDPPacket } from "./packet/LoxoneUDPPacket"
import { LoxoneRemoteSystem } from "./LoxoneRemoteSystem"
import { LoxoneInput } from "./packet/LoxoneInput"


export interface LoxoneServer extends EventEmitter {
  on(eventName: "data", listener: (props: LoxoneServer.DataEvent) => void): this
  on(eventName: "input", listener: (props: LoxoneServer.InputEvent) => void): this
  
  emit(eventName: "data", props: LoxoneServer.DataEvent): boolean
  /**
   * receives inputs from the miniserver
   * @param eventName 
   * @param props 
   */
  emit(eventName: "input", props: LoxoneServer.InputEvent): boolean
}

export class LoxoneServer extends EventEmitter {

  readonly server = dgram.createSocket("udp4")

  constructor(readonly props: LoxoneServer.Props = {}) {
    super()
    this.server.on("message", (buffer, rinfo) => {
      const packet = LoxoneServer.packetFromBuffer(buffer)
      if (!packet) return
      this.emit("data", { rinfo, packet })
      if (packet instanceof LoxoneInput) this.emit("input", { rinfo, packet })
    })
  }

  /**
   * ownId which is being sent to the miniserver for identification purposes
   */
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

  /**
   * listens to the specified port and optional bind address
   * @param port port to listen to
   * @param address set the address to listen to, by default listens on all interfaces
   * @returns 
   */
  bind(port: number, address?: string) {
    return new Promise<void>(resolve => {
      this.server.bind(port, address, () => resolve())
    })
  }

  /**
   * identifies the packet and returns the correct class instance
   * @param buffer 
   * @returns 
   */
  static packetFromBuffer(buffer: Buffer): LoxoneUDPPacket|void {
    const controlByte = buffer.readUInt8(0)
    switch (controlByte) {
      case 0x9e: return new LoxoneInput(buffer)
      case 0x8d: return //not implemented
      default: return console.debug(new Date(), buffer)
    }
  }

}

export namespace LoxoneServer {

  export type Props = {
    //id of the server, leave empty if you want to listen to all incoming packets
    ownId?: string
  }

  export type DataEvent = {
    //udp remote info
    rinfo: dgram.RemoteInfo
    //packet instance
    packet: LoxoneUDPPacket
  }

  export type InputEvent = {
    //udp remote info
    rinfo: dgram.RemoteInfo
    //input data received from the miniserver
    packet: LoxoneInput
  }
}