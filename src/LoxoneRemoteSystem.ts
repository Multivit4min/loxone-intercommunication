import { EventEmitter } from "stream"
import { LoxoneServer } from "./LoxoneServer"
import dgram, { Socket } from "dgram"
import { LoxoneOutput } from "./packet/LoxoneOutput"
import { Output } from "./output/Output"
import { DATA_TYPE } from "./packet/DataType"
import { AnalogOutput } from "./output/AnalogOutput"
import { DigitalOutput } from "./output/DigitalOutput"
import { T5Output } from "./output/T5Output"
import { TextOutput } from "./output/TextOutput"

export class LoxoneRemoteSystem extends EventEmitter {

  private socket: Socket
  private outputs: Output[] = []
  private connectedResolve: Promise<void>

  constructor(readonly props: LoxoneRemoteSystem.Props) {
    super()
    this.socket = dgram.createSocket("udp4")
    this.connectedResolve = new Promise(resolve => {
      this.socket.connect(this.props.port, this.props.address, resolve)
    })
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

  /**
   * fetches the output with the given packetId
   * if no packetId has been previously created and no type has been given it throws an error
   * if no packetId has been previously created but a type has been set, then the output will be created
   * @param packetId name of the packetId to identify it inside the loxone miniserver
   * @param type the type of the packet
   * @returns 
   */
  get(packetId: string, type?: DATA_TYPE) {
    const out = this.findOutput(packetId)
    if (!out && type !== undefined) return this.createOutput(packetId, type)
    if (!out) throw new Error(`could not find packetId "${packetId}"`)
    return out
  }

  private findOutput(packetId: string) {
    return this.outputs.find(o => o.packetId === packetId)
  }

  createOutput(packetId: string, type: DATA_TYPE.DIGITAL): DigitalOutput
  createOutput(packetId: string, type: DATA_TYPE.ANALOG): AnalogOutput
  createOutput(packetId: string, type: DATA_TYPE.TEXT): TextOutput
  createOutput(packetId: string, type: DATA_TYPE.T5): T5Output
  createOutput(packetId: string, type: DATA_TYPE): Output
  createOutput(packetId: string, type: DATA_TYPE) {
    let output = this.findOutput(packetId)
    if (output) throw new Error(`output with name ${packetId} already exists`)
    output = this.createOutputInstance(packetId, type)
    this.outputs.push(output)
    return output
  }

  private createOutputInstance(packetId: string, type: DATA_TYPE) {
    switch (type) {
      case DATA_TYPE.ANALOG: return new AnalogOutput({ packetId, remoteSystem: this })
      case DATA_TYPE.DIGITAL: return new AnalogOutput({ packetId, remoteSystem: this })
      default: throw new Error(`can not create output ${type} is not implemented`)
    }
  }

  send(output: Output) {
    const typeData = LoxoneOutput.getTypeDataFromValue(output.getValue())
    const packet = new LoxoneOutput({
      remoteSystem: this,
      packetId: output.packetId,
      ...typeData
    })
    this.sendBuffer(packet.toBuffer()) 
  }

  private async sendBuffer(buffer: Buffer) {
    await this.connectedResolve
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