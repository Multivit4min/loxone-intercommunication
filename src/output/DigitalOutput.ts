import { Output } from "./Output"

export class DigitalOutput extends Output {

  private value: boolean = false

  setValue(value: boolean) {
    this.value = Boolean(value)
    this.send()
    return this
  }

  getValue() {
    return Boolean(this.value)
  }

}