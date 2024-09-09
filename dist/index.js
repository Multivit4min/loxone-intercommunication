"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AnalogOutput: () => AnalogOutput,
  BufferPacket: () => BufferPacket,
  DATA_TYPE: () => DATA_TYPE,
  DigitalOutput: () => DigitalOutput,
  LoxoneIOPacket: () => LoxoneIOPacket,
  LoxoneInput: () => LoxoneInput,
  LoxoneOutput: () => LoxoneOutput,
  LoxoneRemoteSystem: () => LoxoneRemoteSystem,
  LoxoneServer: () => LoxoneServer,
  LoxoneUDPPacket: () => LoxoneUDPPacket,
  OutputTypeError: () => OutputTypeError,
  SmartActuatorSingleChannelOutput: () => SmartActuatorSingleChannelOutput,
  SmartRGBWOutput: () => SmartRGBWOutput,
  T5Output: () => T5Output,
  TextOutput: () => TextOutput
});
module.exports = __toCommonJS(src_exports);

// src/LoxoneServer.ts
var import_dgram2 = __toESM(require("dgram"));
var import_stream2 = require("stream");

// src/LoxoneRemoteSystem.ts
var import_stream = require("stream");
var import_dgram = __toESM(require("dgram"));

// src/packet/DataType.ts
var DATA_TYPE = /* @__PURE__ */ ((DATA_TYPE2) => {
  DATA_TYPE2[DATA_TYPE2["DIGITAL"] = 0] = "DIGITAL";
  DATA_TYPE2[DATA_TYPE2["ANALOG"] = 1] = "ANALOG";
  DATA_TYPE2[DATA_TYPE2["TEXT"] = 2] = "TEXT";
  DATA_TYPE2[DATA_TYPE2["T5"] = 3] = "T5";
  DATA_TYPE2[DATA_TYPE2["SmartActuatorRGBW"] = 4] = "SmartActuatorRGBW";
  DATA_TYPE2[DATA_TYPE2["SmartActuatorSingleChannel"] = 5] = "SmartActuatorSingleChannel";
  DATA_TYPE2[DATA_TYPE2["SmartActuatorTunableWhite"] = 6] = "SmartActuatorTunableWhite";
  return DATA_TYPE2;
})(DATA_TYPE || {});

// src/packet/LoxoneUDPPacket.ts
var LoxoneUDPPacket = class {
};

// src/packet/LoxoneIOPacket.ts
var LoxoneIOPacket = class extends LoxoneUDPPacket {
  get controlByte() {
    return 158;
  }
};

// src/packet/payload/Payload.ts
var Payload = class {
  constructor(buffer) {
    this.buffer = buffer;
  }
  get byteLength() {
    return this.buffer.byteLength;
  }
};

// src/packet/payload/AnalogPayload.ts
var AnalogPayload = class extends Payload {
  get value() {
    return this.buffer.readDoubleLE(0);
  }
  static bufferFromValue(value) {
    const buffer = Buffer.alloc(8);
    buffer.writeDoubleLE(value);
    return buffer;
  }
};

// src/packet/payload/BufferPayload.ts
var BufferPayload = class extends Payload {
  get value() {
    return this.buffer;
  }
};

// src/packet/payload/DigitalPayload.ts
var DigitalPayload = class extends Payload {
  get value() {
    return Boolean(this.buffer.readUInt8(0));
  }
  static bufferFromValue(value) {
    const buffer = Buffer.alloc(1);
    buffer.writeUint8(value ? 1 : 0);
    return buffer;
  }
};

// src/packet/payload/SmartActuatorSingleChannelPayload.ts
var SmartActuatorSingleChannelPayload = class extends Payload {
  get channel() {
    return this.buffer.readUint8(3);
  }
  get fadeTime() {
    return this.buffer.readUint16LE(4);
  }
  get value() {
    return {
      channel: this.channel,
      fadeTime: this.fadeTime
    };
  }
  static bufferFromValue(data) {
    const buffer = Buffer.alloc(8);
    buffer.writeUint8(data.channel, 3);
    buffer.writeUint16LE(data.fadeTime, 4);
    return buffer;
  }
};

// src/packet/payload/SmartActuatorTunableWhitePayload.ts
var SmartActuatorTunableWhitePayload = class extends Payload {
  get value() {
    return this.buffer;
  }
  static bufferFromValue(data) {
    const buffer = Buffer.alloc(8);
    data.copy(buffer, 0, 0, 8);
    return buffer;
  }
};

// src/packet/payload/SmartRGBWPayload.ts
var SmartRGBWPayload = class extends Payload {
  get red() {
    return this.buffer.readUint8(0);
  }
  get green() {
    return this.buffer.readUint8(1);
  }
  get blue() {
    return this.buffer.readUint8(2);
  }
  get white() {
    return this.buffer.readUint8(3);
  }
  get fadeTime() {
    return this.buffer.readUint16LE(4);
  }
  get bits() {
    return this.buffer.readUint16LE(6);
  }
  get value() {
    return {
      red: this.red,
      green: this.green,
      blue: this.blue,
      white: this.white,
      fadeTime: this.fadeTime,
      bits: this.bits
    };
  }
  static bufferFromValue(data) {
    const buffer = Buffer.alloc(8);
    buffer.writeUint8(data.red, 0);
    buffer.writeUint8(data.green, 1);
    buffer.writeUint8(data.blue, 2);
    buffer.writeUint8(data.white, 3);
    buffer.writeUint16LE(data.fadeTime, 4);
    buffer.writeUint16LE(data.bits || 0, 6);
    return buffer;
  }
};

// src/packet/payload/T5Payload.ts
var T5Payload = class extends Payload {
  get value() {
    return {
      button: this.buffer.readUint16LE(6)
    };
  }
  static bufferFromValue({ button }) {
    const buffer = Buffer.alloc(8);
    buffer.writeUint16LE(button, 6);
    return buffer;
  }
};
((T5Payload2) => {
  let ButtonPressed;
  ((ButtonPressed2) => {
    ButtonPressed2[ButtonPressed2["NONE"] = 0] = "NONE";
    ButtonPressed2[ButtonPressed2["MIDDLE"] = 16400] = "MIDDLE";
    ButtonPressed2[ButtonPressed2["LEFT_UPPER"] = 16368] = "LEFT_UPPER";
    ButtonPressed2[ButtonPressed2["LEFT_LOWER"] = 16416] = "LEFT_LOWER";
    ButtonPressed2[ButtonPressed2["RIGHT_UPPER"] = 16384] = "RIGHT_UPPER";
    ButtonPressed2[ButtonPressed2["RIGHT_LOWER"] = 16432] = "RIGHT_LOWER";
  })(ButtonPressed = T5Payload2.ButtonPressed || (T5Payload2.ButtonPressed = {}));
})(T5Payload || (T5Payload = {}));

// src/packet/payload/TextPayload.ts
var TextPayload = class extends Payload {
  get value() {
    return this.buffer.toString("utf8", 0, this.byteLength - 1);
  }
  static bufferFromValue(value) {
    return Buffer.concat([Buffer.from(value, "utf8"), Buffer.from([0])]);
  }
};

// src/packet/LoxoneOutput.ts
var LoxoneOutput = class _LoxoneOutput extends LoxoneIOPacket {
  constructor(props) {
    super();
    this.props = props;
    this.payloadBuffer = _LoxoneOutput.createPayloadBuffer(props);
    this.sourceId = props.remoteSystem.ownId;
    this.targetId = props.remoteSystem.remoteId;
    this.packetId = props.packetId;
    this.type = props.type;
  }
  get payloadLength() {
    return this.payloadBuffer.byteLength;
  }
  get payload() {
    if (!this._payload) this._payload = this.createPayload();
    return this._payload;
  }
  toBuffer() {
    const buffer = Buffer.alloc(38);
    buffer.writeUint8(158);
    Buffer.from(this.sourceId, "utf8").copy(buffer, 8, 0, 8);
    Buffer.from(this.targetId, "utf8").copy(buffer, 17, 0, 8);
    Buffer.from(this.packetId, "utf8").copy(buffer, 26, 0, 8);
    buffer.writeUint8(this.payloadLength, 35);
    buffer.writeUint8(this.type, 37);
    return Buffer.concat([buffer, this.payloadBuffer]);
  }
  createPayload() {
    switch (this.type) {
      case 1 /* ANALOG */:
        return new AnalogPayload(this.payloadBuffer);
      case 0 /* DIGITAL */:
        return new DigitalPayload(this.payloadBuffer);
      case 2 /* TEXT */:
        return new TextPayload(this.payloadBuffer);
      case 3 /* T5 */:
        return new T5Payload(this.payloadBuffer);
      case 4 /* SmartActuatorRGBW */:
        return new SmartRGBWPayload(this.payloadBuffer);
      case 5 /* SmartActuatorSingleChannel */:
        return new SmartActuatorSingleChannelPayload(this.payloadBuffer);
      case 6 /* SmartActuatorTunableWhite */:
        return new SmartActuatorTunableWhitePayload(this.payloadBuffer);
      default:
        return new BufferPayload(this.payloadBuffer);
    }
  }
  static createPayloadBuffer({ type, value }) {
    switch (type) {
      case 1 /* ANALOG */:
        return AnalogPayload.bufferFromValue(value);
      case 0 /* DIGITAL */:
        return DigitalPayload.bufferFromValue(value);
      case 2 /* TEXT */:
        return TextPayload.bufferFromValue(value);
      case 3 /* T5 */:
        return T5Payload.bufferFromValue(value);
      case 4 /* SmartActuatorRGBW */:
        return SmartRGBWPayload.bufferFromValue(value);
      case 5 /* SmartActuatorSingleChannel */:
        return SmartActuatorSingleChannelPayload.bufferFromValue(value);
      case 6 /* SmartActuatorTunableWhite */:
        return SmartActuatorTunableWhitePayload.bufferFromValue(value);
      default:
        throw new Error(`data type ${type} is not implemented`);
    }
  }
  static getTypeDataFromValue(value) {
    switch (typeof value) {
      case "string":
        return { type: 2 /* TEXT */, value };
      case "number":
        return { type: 1 /* ANALOG */, value };
      case "boolean":
        return { type: 0 /* DIGITAL */, value };
      case "object":
        const v = value;
        if (v instanceof Buffer) {
          return { type: 6 /* SmartActuatorTunableWhite */, value: v };
        } else if (!isNaN(v["button"])) {
          return { type: 3 /* T5 */, value: v };
        } else if (!isNaN(v["red"]) && !isNaN(v["green"]) && !isNaN(v["blue"]) && !isNaN(v["white"])) {
          return { type: 4 /* SmartActuatorRGBW */, value: v };
        } else if (v["channel"]) {
          return { type: 5 /* SmartActuatorSingleChannel */, value: v };
        }
      default:
        throw new Error(`unknown value type: ${typeof value}`);
    }
  }
};

// src/error/OutputTypeError.ts
var OutputTypeError = class extends Error {
  constructor(output, value) {
    super(`invalid output type provided for packetId ${output.packetId} with value ${value} (type: ${typeof value})`);
    this.output = output;
    this.value = value;
  }
};

// src/output/Output.ts
var Output = class {
  constructor(props) {
    this.props = props;
    this._updateInterval = 10 * 1e3;
    this.updateInterval();
  }
  get remoteSystem() {
    return this.props.remoteSystem;
  }
  isValidRange(data, color, min = 0, max = 101) {
    return typeof data[color] === "number" && data[color] >= min && data[color] <= max;
  }
  get packetId() {
    return this.props.packetId;
  }
  updateInterval() {
    clearInterval(this._interval);
    this._interval = setInterval(() => this.send(), this._updateInterval);
  }
  setInterval(time) {
    this._updateInterval = time;
    this.updateInterval();
    return this;
  }
  send() {
    this.updateInterval();
    return this.remoteSystem.send(this);
  }
};

// src/output/AnalogOutput.ts
var AnalogOutput = class extends Output {
  constructor() {
    super(...arguments);
    this.value = 0;
  }
  setValueFromString(value) {
    return this.setValue(parseFloat(value));
  }
  isTypeValid(value) {
    return typeof value === "number" && isFinite(value) && !isNaN(value);
  }
  setValue(value) {
    if (!this.isTypeValid(value)) throw new OutputTypeError(this, value);
    this.value = value;
    this.send();
    return this;
  }
  getValue() {
    return this.value;
  }
};

// src/output/DigitalOutput.ts
var DigitalOutput = class extends Output {
  constructor() {
    super(...arguments);
    this.value = false;
  }
  setValueFromString(value) {
    return this.setValue(value.toLowerCase() === "true");
  }
  isTypeValid(value) {
    return typeof value === "boolean";
  }
  setValue(value) {
    if (!this.isTypeValid(value)) throw new OutputTypeError(this, value);
    this.value = Boolean(value);
    this.send();
    return this;
  }
  getValue() {
    return Boolean(this.value);
  }
};

// src/output/T5Output.ts
var T5Output = class extends Output {
  constructor() {
    super(...arguments);
    this.value = { button: T5Payload.ButtonPressed.NONE };
  }
  setValueFromString(value) {
    return this.setValue(JSON.parse(value));
  }
  isTypeValid(value) {
    return typeof value === "object" && typeof value !== null && value["button"] && typeof value["button"] === "number";
  }
  setValue(button) {
    if (!this.isTypeValid({ button })) throw new OutputTypeError(this, { button });
    this.value = { button };
    this.send();
    return this;
  }
  getValue() {
    return this.value;
  }
};

// src/output/TextOutput.ts
var TextOutput = class extends Output {
  constructor() {
    super(...arguments);
    this.value = "";
  }
  setValueFromString(value) {
    return this.setValue(value);
  }
  isTypeValid(value) {
    return typeof value === "string";
  }
  setValue(value) {
    if (!this.isTypeValid(value)) throw new OutputTypeError(this, value);
    this.value = value;
    this.send();
    return this;
  }
  getValue() {
    return this.value;
  }
};

// src/output/SmartRGBWOutput.ts
var SmartRGBWOutput = class extends Output {
  constructor() {
    super(...arguments);
    this.value = {
      red: 0,
      green: 0,
      blue: 0,
      white: 0,
      fadeTime: 0.2,
      bits: 0
    };
  }
  setValueFromString(value) {
    return this.setValue(JSON.parse(value));
  }
  isTypeValid(value) {
    return typeof value === "object" && value !== null && this.isValidRange(value, "red") && this.isValidRange(value, "green") && this.isValidRange(value, "blue") && this.isValidRange(value, "white") && this.isValidRange(value, "fadeTime", 0, 65535) && this.isValidRange(value, "bits", 0, 65535);
  }
  setPartial(props) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, props);
    this.setValue(__spreadValues(__spreadValues({}, this.value), props));
    return this;
  }
  setValue(props) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, props);
    this.value = __spreadValues({}, props);
    this.send();
    return this;
  }
  getValue() {
    return this.value;
  }
};

// src/output/SmartActuatorSingleChannel.ts
var SmartActuatorSingleChannelOutput = class extends Output {
  constructor() {
    super(...arguments);
    this.value = {
      channel: 0,
      fadeTime: 0.2
    };
  }
  setValueFromString(value) {
    return this.setValue(JSON.parse(value));
  }
  isTypeValid(value) {
    return typeof value === "object" && value !== null && this.isValidRange(value, "channel") && this.isValidRange(value, "fadeTime", 0, 65535);
  }
  setPartial(props) {
    return this.setValue(__spreadValues(__spreadValues({}, this.value), props));
  }
  setValue(props) {
    if (!this.isTypeValid(props)) throw new OutputTypeError(this, props);
    this.value = __spreadValues({}, props);
    this.send();
    return this;
  }
  getValue() {
    return this.value;
  }
};

// src/LoxoneRemoteSystem.ts
var LoxoneRemoteSystem = class extends import_stream.EventEmitter {
  constructor(props) {
    super();
    this.props = props;
    this.outputs = [];
    this.socket = import_dgram.default.createSocket("udp4");
    this.connectedResolve = new Promise((resolve) => {
      this.socket.connect(this.props.port, this.props.address, resolve);
    });
  }
  /**
   * server instance the remote system belongs to
   */
  get server() {
    return this.props.server;
  }
  /**
   * ownId which is being sent to the remote miniserver
   */
  get ownId() {
    return this.server.ownId;
  }
  /**
   * remoteId which has been set on the remote miniserver
   */
  get remoteId() {
    return this.props.remoteId;
  }
  /**
   * fetches the output with the given packetId
   * if no packetId has been previously created and no type has been given it throws an error
   * if no packetId has been previously created but a type has been set, then the output will be created
   * @param packetId name of the packetId to identify it inside the loxone miniserver
   * @param type the type of the packet
   * @returns 
   */
  get(packetId, type) {
    const out = this.findOutput(packetId);
    if (!out && type !== void 0) return this.createOutput(packetId, type);
    if (!out) throw new Error(`could not find packetId "${packetId}"`);
    return out;
  }
  /**
   * finds an output by the packetId in the output list
   * @param packetId name to find
   * @returns 
   */
  findOutput(packetId) {
    return this.outputs.find((o) => o.packetId === packetId);
  }
  createOutput(packetId, type) {
    let output = this.findOutput(packetId);
    if (output) throw new Error(`output with name ${packetId} already exists`);
    output = this.createOutputInstance(packetId, type);
    this.outputs.push(output);
    return output;
  }
  /**
   * creates the instance object of the output
   * @param packetId name of the output
   * @param type type of the output
   * @returns 
   */
  createOutputInstance(packetId, type) {
    switch (type) {
      case 0 /* DIGITAL */:
        return new DigitalOutput({ packetId, remoteSystem: this });
      case 1 /* ANALOG */:
        return new AnalogOutput({ packetId, remoteSystem: this });
      case 2 /* TEXT */:
        return new TextOutput({ packetId, remoteSystem: this });
      case 3 /* T5 */:
        return new T5Output({ packetId, remoteSystem: this });
      case 4 /* SmartActuatorRGBW */:
        return new SmartRGBWOutput({ packetId, remoteSystem: this });
      case 5 /* SmartActuatorSingleChannel */:
        return new SmartActuatorSingleChannelOutput({ packetId, remoteSystem: this });
      default:
        throw new Error(`can not create output ${type} is not implemented`);
    }
  }
  /**
   * sends the output to the miniserver
   * @param output 
   */
  send(output) {
    const typeData = LoxoneOutput.getTypeDataFromValue(output.getValue());
    const packet = new LoxoneOutput(__spreadValues({
      remoteSystem: this,
      packetId: output.packetId
    }, typeData));
    this.sendBuffer(packet.toBuffer());
  }
  /**
   * sends the buffer to the miniserver
   * @param buffer 
   * @returns 
   */
  sendBuffer(buffer) {
    return __async(this, null, function* () {
      yield this.connectedResolve;
      return this.socket.send(buffer);
    });
  }
};

// src/packet/LoxoneInput.ts
var LoxoneInput = class extends LoxoneIOPacket {
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }
  get sourceId() {
    return this.buffer.subarray(8, 16).toString("utf8").replace(/\x00/g, "");
  }
  get targetId() {
    return this.buffer.subarray(17, 25).toString("utf8").replace(/\x00/g, "");
  }
  get packetId() {
    return this.buffer.subarray(26, 34).toString("utf8").replace(/\x00/g, "");
  }
  get payloadLength() {
    return this.buffer.readUint16LE(35);
  }
  get type() {
    return this.buffer.readUInt8(37);
  }
  get payloadBuffer() {
    return this.buffer.subarray(38, 38 + this.payloadLength);
  }
  get payload() {
    if (!this._payload) this._payload = this.createPayload();
    return this._payload;
  }
  toBuffer() {
    const buffer = Buffer.alloc(38);
    buffer.writeUint8(158);
    Buffer.from(this.sourceId, "utf8").copy(buffer, 8, 0, 8);
    Buffer.from(this.targetId, "utf8").copy(buffer, 17, 0, 8);
    Buffer.from(this.packetId, "utf8").copy(buffer, 26, 0, 8);
    buffer.writeUint8(this.payloadLength, 35);
    buffer.writeUint8(this.type, 37);
    return Buffer.concat([buffer, this.payloadBuffer]);
  }
  createPayload() {
    switch (this.type) {
      case 1 /* ANALOG */:
        return new AnalogPayload(this.payloadBuffer);
      case 0 /* DIGITAL */:
        return new DigitalPayload(this.payloadBuffer);
      case 2 /* TEXT */:
        return new TextPayload(this.payloadBuffer);
      case 3 /* T5 */:
        return new T5Payload(this.payloadBuffer);
      case 4 /* SmartActuatorRGBW */:
        return new SmartRGBWPayload(this.payloadBuffer);
      case 5 /* SmartActuatorSingleChannel */:
        return new SmartActuatorSingleChannelPayload(this.payloadBuffer);
      case 6 /* SmartActuatorTunableWhite */:
        return new SmartActuatorTunableWhitePayload(this.payloadBuffer);
      default:
        return new BufferPayload(this.payloadBuffer);
    }
  }
};

// src/LoxoneServer.ts
var LoxoneServer = class _LoxoneServer extends import_stream2.EventEmitter {
  constructor(props = {}) {
    super();
    this.props = props;
    this.server = import_dgram2.default.createSocket("udp4");
    this.server.on("message", (buffer, rinfo) => {
      const packet = _LoxoneServer.packetFromBuffer(buffer);
      if (!packet) return;
      this.emit("data", { rinfo, packet });
      if (packet instanceof LoxoneInput) this.emit("input", { rinfo, packet });
    });
  }
  /**
   * ownId which is being sent to the miniserver for identification purposes
   */
  get ownId() {
    return this.props.ownId || "";
  }
  /**
   * creates a new remote system which sends inputs and
   * receives output from a loxone server
   * @param remoteId 
   * @returns 
   */
  createRemoteSystem(props) {
    return new LoxoneRemoteSystem(__spreadProps(__spreadValues({}, props), { server: this }));
  }
  /**
   * listens to the specified port and optional bind address
   * @param port port to listen to
   * @param address set the address to listen to, by default listens on all interfaces
   * @returns 
   */
  bind(port, address) {
    return new Promise((resolve) => {
      this.server.bind(port, address, () => resolve());
    });
  }
  /**
   * identifies the packet and returns the correct class instance
   * @param buffer 
   * @returns 
   */
  static packetFromBuffer(buffer) {
    const controlByte = buffer.readUInt8(0);
    switch (controlByte) {
      case 158:
        return new LoxoneInput(buffer);
      case 141:
        return;
      //not implemented
      default:
        return console.debug(/* @__PURE__ */ new Date(), buffer);
    }
  }
};

// src/packet/BufferPacket.ts
var BufferPacket = class extends LoxoneUDPPacket {
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }
  get controlByte() {
    return this.buffer.readUint8(0);
  }
  toBuffer() {
    return this.buffer;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnalogOutput,
  BufferPacket,
  DATA_TYPE,
  DigitalOutput,
  LoxoneIOPacket,
  LoxoneInput,
  LoxoneOutput,
  LoxoneRemoteSystem,
  LoxoneServer,
  LoxoneUDPPacket,
  OutputTypeError,
  SmartActuatorSingleChannelOutput,
  SmartRGBWOutput,
  T5Output,
  TextOutput
});
//# sourceMappingURL=index.js.map