import { T5Payload } from "../packet/payload/T5Payload"
import { Output } from "./Output"

export class T5Output extends Output {

  private value: T5Payload.Type = { button: T5Payload.ButtonPressed.NONE }

  setValue(button: T5Payload.ButtonPressed) {
    this.value = { button }
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}