export abstract class Payload {

  constructor(readonly buffer: Buffer) {}

  abstract get value(): any
  
  get byteLength() {
    return this.buffer.byteLength
  }
}