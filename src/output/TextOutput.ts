import { OutputTypeError } from "../error/OutputTypeError"
import { Output } from "./Output"

export class TextOutput extends Output {

  private value: string = ""

  setValueFromString(value: string) {
    return this.setValue(value)
  }

  isTypeValid(value: any) {
    return typeof value === "string"
  }

  setValue(value: string) {
    if (!this.isTypeValid(value)) throw new OutputTypeError(this, value)
    this.value = value
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}