import { OutputTypeError } from "../error/OutputTypeError"
import { T5Payload } from "../packet/payload/T5Payload"
import { Output } from "./Output"

export class T5Output extends Output {

  private value: T5Payload.Type = { button: T5Payload.ButtonPressed.NONE }

  setValueFromString(value: string) {
    return this.setValue(JSON.parse(value))
  }

  isTypeValid(value: any) {
    return (
      typeof value === "object" &&
      typeof value !== null &&
      typeof value["button"] === "number"
    )
  }

  setValue(props: T5Payload.Type) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, { button: props.button })
    this.value = { button: props.button }
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}