import { Payload } from "./Payload"

export class SmartActuatorTunableWhitePayload extends Payload {

  /** temperature in kelvin */
  get temperature() {
    return this.buffer.readUInt16LE(0)
  }

  /** brightness in % */
  get brightness() {
    return this.buffer.readUint16LE(2)
  }

  get fadeTime() {
    return this.buffer.readUint16LE(4) / 10
  }

  get value(): SmartActuatorTunableWhitePayload.Type {
    return {
      temperature: this.temperature,
      brightness: this.brightness,
      fadeTime: this.fadeTime
    }
  }

  static bufferFromValue(data: SmartActuatorTunableWhitePayload.Type) {
    const buffer = Buffer.alloc(8)
    buffer.writeUint16LE(data.temperature, 0)
    buffer.writeUint16LE(data.brightness, 2)
    buffer.writeUint16LE(Math.round(data.fadeTime * 10), 4)
    return buffer
  }
}

export namespace SmartActuatorTunableWhitePayload {

  export type Type = {
    /** temperature in kelvin */
    temperature: number
    /** brightness in % */
    brightness: number
    /** fadeTime in seconds */
    fadeTime: number
  }

}