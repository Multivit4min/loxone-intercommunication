import { OutputTypeError } from "../error/OutputTypeError"
import { Output } from "./Output"

export class DigitalOutput extends Output {

  private value: boolean = false

  setValueFromString(value: string) {
    return this.setValue(value.toLowerCase() === "true")
  }

  isTypeValid(value: any) {
    return typeof value === "boolean"
  }

  setValue(value: boolean) {
    if (!this.isTypeValid(value)) throw new OutputTypeError(this, value)
    this.value = Boolean(value)
    this.send()
    return this
  }

  getValue() {
    return Boolean(this.value)
  }

}