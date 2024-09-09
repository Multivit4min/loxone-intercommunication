import { LoxoneRemoteSystem } from "../LoxoneRemoteSystem"
import { LoxoneOutput } from "../packet/LoxoneOutput"

export abstract class Output {

  private _interval?: NodeJS.Timeout
  private _updateInterval: number = 10 * 1000

  constructor(readonly props: Output.Props) {
    this.updateInterval()
  }

  protected get remoteSystem() {
    return this.props.remoteSystem
  }

  abstract setValue(value: LoxoneOutput.TypeFromValue): this
  abstract getValue(): LoxoneOutput.TypeFromValue

  get packetId() {
    return this.props.packetId
  }

  private updateInterval() {
    clearInterval(this._interval)
    this._interval = setInterval(() => this.send(), this._updateInterval)
  }

  setInterval(time: number) {
    this._updateInterval = time
    this.updateInterval()
    return this
  }

  send() {
    this.updateInterval()
    return this.remoteSystem.send(this)
  }

}

export namespace Output {

  export type Props = {
    remoteSystem: LoxoneRemoteSystem
    packetId: string
  }

}