import { OutputTypeError } from "../error/OutputTypeError"
import { Output } from "./Output"

export class AnalogOutput extends Output {

  private value: number = 0

  setValueFromString(value: string) {
    return this.setValue(parseFloat(value))
  }

  isTypeValid(value: any) {
    return (
      typeof value === "number" &&
      isFinite(value) &&
      !isNaN(value)
    )
  }

  setValue(value: number) {
    if (!this.isTypeValid(value)) throw new OutputTypeError(this, value)
    this.value = value
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}