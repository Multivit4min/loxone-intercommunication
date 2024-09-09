import { Output } from "./Output"

export class TextOutput extends Output {

  private value: string = ""

  setValue(value: string) {
    this.value = value
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}