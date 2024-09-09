import { Output } from "./Output"

export class AnalogOutput extends Output {

  private value: number = 0

  setValue(value: number) {
    this.value = value
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}