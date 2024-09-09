import { Output } from "../output/Output"

export class OutputTypeError extends Error {

  constructor(readonly output: Output, readonly value: any) {
    super(`invalid output type provided for packetId ${output.packetId} with value ${value} (type: ${typeof value})`)
  }

}