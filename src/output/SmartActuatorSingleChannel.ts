import { OutputTypeError } from "../error/OutputTypeError"
import { SmartActuatorSingleChannelPayload } from "../packet/payload/SmartActuatorSingleChannelPayload"
import { Output } from "./Output"

export class SmartActuatorSingleChannelOutput extends Output {

  private value: SmartActuatorSingleChannelPayload.Type = {
    channel: 0,
    fadeTime: 0.2
  }

  setValueFromString(value: string) {
    return this.setValue(JSON.parse(value))
  }

  isTypeValid(value: any) {
    return (
      typeof value === "object" &&
      value !== null &&
      this.isValidRange(value, "channel") &&
      this.isValidRange(value, "fadeTime", 0, 0xFFFF)
    )
  }

  setPartial(props: Partial<SmartActuatorSingleChannelPayload.Type>) {
    return this.setValue({ ...this.value, ...props })
  }

  setValue(props: SmartActuatorSingleChannelPayload.Type) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, props)
    this.value = { ...props }
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}