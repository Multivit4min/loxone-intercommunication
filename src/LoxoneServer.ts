import dgram from "dgram"
import { EventEmitter } from "stream"
import { LoxoneUDPPacket } from "./packet/LoxoneUDPPacket"


export interface LoxoneUDPServer extends EventEmitter {
  on(eventName: "data", listener: (props: LoxoneUDPServer.DataEvent) => void): this
  
  emit(eventName: "data", props: LoxoneUDPServer.DataEvent): boolean
}

export class LoxoneUDPServer extends EventEmitter {

  readonly server = dgram.createSocket("udp4")

  constructor() {
    super()
    this.server.on("message", (buffer, rinfo) => {
      this.emit("data", { rinfo, packet: new LoxoneUDPPacket(buffer) })
    })
  }

  bind(port: number, address?: string) {
    return new Promise<void>(resolve => {
      this.server.bind(port, address, () => {
        resolve()
      })
    })
  }

}

export namespace LoxoneUDPServer {
  export type DataEvent = {
    rinfo: dgram.RemoteInfo
    packet: LoxoneUDPPacket
  }
}