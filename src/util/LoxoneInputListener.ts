import { SmartRGBWPayload } from "../packet/payload/SmartRGBWPayload.js"
import { SmartActuatorSingleChannelPayload } from "../packet/payload/SmartActuatorSingleChannelPayload.js"
import { SmartActuatorTunableWhitePayload } from "../packet/payload/SmartActuatorTunableWhitePayload.js"
import { T5Payload } from "../packet/payload/T5Payload.js"
import { LoxoneInput } from "../packet/LoxoneInput.js"
import { DATA_TYPE } from "../packet/DataType.js"

export class LoxoneInputListener {

  private listeners: LoxoneInputListener.ListenerDict = {
    digital: [],
    risingEdge: [],
    fallingEdge: [],
    analog: [],
    text: [],
    t5: [],
    smartRgbw: [],
    smartActuatorSingleChannel: [],
    smartActuatorTunableWhite: []
  }

  private lastValue: any

  constructor(readonly id: string|RegExp) {
  }

  private addListener<
    K extends keyof LoxoneInputListener.ListenerDict, 
    V extends LoxoneInputListener.Unpack<LoxoneInputListener.ListenerDict[K]>
  >(key: K, cb: V) {
    return (this.listeners[key] as V[]).push(cb)
  }

  private execListener(key: keyof LoxoneInputListener.ListenerDict, value: any) {
    //@ts-ignore
    this.listeners[key].forEach(cb => cb(value))
  }

  digital(cb: LoxoneInputListener.DigitalCallbackHandler) {
    return this.addListener("digital", cb)
  }

  risingEdge(cb: LoxoneInputListener.DigitalCallbackHandler) {
    return this.addListener("risingEdge", cb)
  }

  fallingEdge(cb: LoxoneInputListener.DigitalCallbackHandler) {
    return this.addListener("fallingEdge", cb)
  }

  analog(cb: LoxoneInputListener.AnalogCallbackHandler) {
    return this.addListener("analog", cb)
  }

  text(cb: LoxoneInputListener.TextCallbackHandler) {
    return this.addListener("text", cb)
  }

  smartRgbw(cb: LoxoneInputListener.SmartRGBWCallbackHandler) {
    return this.addListener("smartRgbw", cb)
  }

  smartActuatorSingleChannel(cb: LoxoneInputListener.SmartActuatorSingleChannelCallbackHandler) {
    return this.addListener("smartActuatorSingleChannel", cb)
  }

  smartActuatorTunableWhite(cb: LoxoneInputListener.SmartActuatorSingleChannelCallbackHandler) {
    return this.addListener("smartActuatorSingleChannel", cb)
  }

  receive({ type, payload }: LoxoneInput) {
    const value = payload.value
    if (value === this.lastValue) return
    this.lastValue = value
    switch (type) {
      case DATA_TYPE.ANALOG: return this.execListener("analog", value)
      case DATA_TYPE.DIGITAL: 
        this.execListener(value ? "risingEdge" : "fallingEdge", null)
        return this.execListener("digital", value)
      case DATA_TYPE.TEXT: return this.execListener("text", value)
      case DATA_TYPE.T5: return this.execListener("t5", value)
      case DATA_TYPE.SmartActuatorRGBW: return this.execListener("smartRgbw", value)
      case DATA_TYPE.SmartActuatorSingleChannel: return this.execListener("smartActuatorSingleChannel", value)
      case DATA_TYPE.SmartActuatorTunableWhite: return this.execListener("smartActuatorTunableWhite", value)
    }
  }

  /** checks if the input is exactly the same (type and regex) as the set id */
  matchExact(id: string|RegExp) {
    if (typeof id === "string") return id === this.id
    if (!(id instanceof RegExp) || !(this.id instanceof RegExp)) return false
    return id.toString() === this.id.toString()
  }

  /** validates and checks if the input matches the id of the input listener */
  match(id: string) {
    if (this.id instanceof RegExp) return this.id.test(id)
    return this.id === id
  }
}

export namespace LoxoneInputListener {

  export type ListenerDict = {
    digital: DigitalCallbackHandler[]
    risingEdge: DigitalCallbackHandler[]
    fallingEdge: DigitalCallbackHandler[]
    analog: AnalogCallbackHandler[]
    text: TextCallbackHandler[]
    t5: T5CallbackHandler[]
    smartRgbw: SmartRGBWCallbackHandler[]
    smartActuatorSingleChannel: SmartActuatorSingleChannelCallbackHandler[]
    smartActuatorTunableWhite: SmartActuatorTunableWhiteCallbackHandler[]
  }
  
  export type CallbackHandler<T> = (value: T) => void
  export type DigitalCallbackHandler = CallbackHandler<boolean>
  export type AnalogCallbackHandler = CallbackHandler<number>
  export type TextCallbackHandler = CallbackHandler<string>
  export type T5CallbackHandler = CallbackHandler<T5Payload.Type>
  export type SmartRGBWCallbackHandler = CallbackHandler<SmartRGBWPayload.Type>
  export type SmartActuatorSingleChannelCallbackHandler = CallbackHandler<SmartActuatorSingleChannelPayload.Type>
  export type SmartActuatorTunableWhiteCallbackHandler = CallbackHandler<SmartActuatorTunableWhitePayload.Type>

  export type Unpack<T> = T extends (infer U)[] ? U : T
}