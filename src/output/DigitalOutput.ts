import { Output } from "./Output"

export class DigitalOutput extends Output {

  private value: boolean = false

  setValue(value: boolean) {
    this.value = value
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}