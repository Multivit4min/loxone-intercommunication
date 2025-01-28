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

  private triggerValue(edge: boolean, time = 1000) {
    this.setValue(edge)
    setTimeout(() => this.setValue(!edge), time)
  }

  /** triggers the current value high and then sets it back to 0 after a given time */
  triggerHigh(time = 1000) {
    return this.triggerValue(true, time)
  }

  /** triggers the current value low and then sets it back to 0 after a given time */
  triggerLow(time = 1000) {
    return this.triggerValue(false, time)
  }

  getValue() {
    return Boolean(this.value)
  }

}