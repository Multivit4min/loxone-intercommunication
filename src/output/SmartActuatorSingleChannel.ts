import { SmartActuatorSingleChannelPayload } from "../packet/payload/SmartActuatorSingleChannelPayload"
import { Output } from "./Output"

export class SmartActuatorSingleChannelOutput extends Output {

  private value: SmartActuatorSingleChannelPayload.Type = {
    channel: 0,
    fadeTime: 0.2
  }

  setPartial(props: Partial<SmartActuatorSingleChannelPayload.Type>) {
    this.setValue({ ...this.value, ...props })
    return this
  }

  setValue(props: SmartActuatorSingleChannelPayload.Type) {
    this.value = { ...props }
    this.send()
    return this
  }

  getValue() {
    return this.value
  }

}