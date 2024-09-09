import { SmartRGBWPayload } from "../packet/payload/SmartRGBWPayload"
import { Output } from "./Output"

export class SmartRGBWOutput extends Output {

  private value: SmartRGBWPayload.Type = {
    red: 0,
    green: 0,
    blue: 0,
    white: 0,
    fadeTime: 0.2,
    bits: 0
  }

  setPartial(props: Partial<SmartRGBWPayload.Type>) {
    this.setValue({ ...this.value, ...props })
    return this
  }

  setValue(props: SmartRGBWPayload.Type) {
    this.value = { ...props }
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}