import { OutputTypeError } from "../error/OutputTypeError"
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

  setValueFromString(value: string) {
    return this.setValue(JSON.parse(value))
  }

  isTypeValid(value: any) {
    return (
      typeof value === "object" &&
      value !== null &&
      this.isValidRange(value, "red") &&
      this.isValidRange(value, "green") &&
      this.isValidRange(value, "blue") &&
      this.isValidRange(value, "white") &&
      this.isValidRange(value, "fadeTime", 0, 0xFFFF) &&
      this.isValidRange(value, "bits", 0, 0xFFFF)
    )
  }

  setPartial(props: Partial<SmartRGBWPayload.Type>) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, props)
    this.setValue({ ...this.value, ...props })
    return this
  }

  setValue(props: SmartRGBWPayload.Type) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, props)
    this.value = { ...props }
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}