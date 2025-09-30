import dgram from 'dgram';
import { EventEmitter } from 'stream';

declare abstract class LoxoneUDPPacket {
    abstract get controlByte(): number;
}

declare enum DATA_TYPE {
    DIGITAL = 0,
    ANALOG = 1,
    TEXT = 2,
    T5 = 3,
    SmartActuatorRGBW = 4,
    SmartActuatorSingleChannel = 5,
    SmartActuatorTunableWhite = 6
}

declare abstract class Payload {
    readonly buffer: Buffer;
    constructor(buffer: Buffer);
    abstract get value(): any;
    get byteLength(): number;
}

declare abstract class LoxoneIOPacket extends LoxoneUDPPacket {
    get controlByte(): number;
    abstract get packetId(): string;
    abstract get payload(): Payload;
    abstract get dataType(): DATA_TYPE;
}

declare class SmartActuatorSingleChannelPayload extends Payload {
    get channel(): number;
    get fadeTime(): number;
    get value(): SmartActuatorSingleChannelPayload.Type;
    static bufferFromValue(data: SmartActuatorSingleChannelPayload.Type): Buffer<ArrayBuffer>;
}
declare namespace SmartActuatorSingleChannelPayload {
    type Type = {
        channel: number;
        fadeTime: number;
    };
}

declare class SmartRGBWPayload extends Payload {
    get red(): number;
    get green(): number;
    get blue(): number;
    get white(): number;
    get fadeTime(): number;
    get bits(): number;
    get value(): SmartRGBWPayload.Type;
    static bufferFromValue(data: SmartRGBWPayload.Type): Buffer<ArrayBuffer>;
}
declare namespace SmartRGBWPayload {
    type Type = {
        red: number;
        green: number;
        blue: number;
        white: number;
        fadeTime: number;
        bits?: number;
    };
}

declare class T5Payload extends Payload {
    get value(): T5Payload.Type;
    static bufferFromValue({ button }: T5Payload.Type): Buffer<ArrayBuffer>;
}
declare namespace T5Payload {
    type Type = {
        button: ButtonPressed;
    };
    enum ButtonPressed {
        NONE = 0,
        MIDDLE = 16400,
        LEFT_UPPER = 16368,
        LEFT_LOWER = 16416,
        RIGHT_UPPER = 16384,
        RIGHT_LOWER = 16432
    }
}

declare class LoxoneOutput extends LoxoneIOPacket {
    readonly props: LoxoneOutput.Props;
    private _payload?;
    sourceId: string;
    targetId: string;
    packetId: string;
    type: DATA_TYPE;
    payloadBuffer: Buffer;
    constructor(props: LoxoneOutput.Props);
    get payloadLength(): number;
    get payload(): Payload;
    get dataType(): DATA_TYPE;
    toBuffer(): Buffer<ArrayBuffer>;
    private createPayload;
    static createPayloadBuffer({ type, value }: LoxoneOutput.PayloadDataType): Buffer<ArrayBuffer>;
    static getTypeDataFromValue(value: LoxoneOutput.TypeFromValue): LoxoneOutput.PayloadDataType;
}
declare namespace LoxoneOutput {
    type Props = {
        remoteSystem: LoxoneRemoteSystem;
        packetId: string;
    } & PayloadDataType;
    type TypeFromValue = number | boolean | string | T5Payload.Type | SmartRGBWPayload.Type | SmartActuatorSingleChannelPayload.Type | Buffer;
    type PayloadDataType = {
        type: DATA_TYPE.ANALOG;
        value: number;
    } | {
        type: DATA_TYPE.DIGITAL;
        value: boolean;
    } | {
        type: DATA_TYPE.TEXT;
        value: string;
    } | {
        type: DATA_TYPE.T5;
        value: T5Payload.Type;
    } | {
        type: DATA_TYPE.SmartActuatorRGBW;
        value: SmartRGBWPayload.Type;
    } | {
        type: DATA_TYPE.SmartActuatorSingleChannel;
        value: SmartActuatorSingleChannelPayload.Type;
    } | {
        type: DATA_TYPE.SmartActuatorTunableWhite;
        value: Buffer;
    };
}

declare abstract class Output {
    readonly props: Output.Props;
    private _interval?;
    private _updateInterval;
    constructor(props: Output.Props);
    protected get remoteSystem(): LoxoneRemoteSystem;
    abstract setValueFromString(value: string): this;
    abstract isTypeValid(value: any): boolean;
    abstract setValue(value: LoxoneOutput.TypeFromValue): this;
    abstract getValue(): LoxoneOutput.TypeFromValue;
    protected isValidRange<T extends Record<string, any>>(data: T, color: keyof T, min?: number, max?: number): boolean;
    get packetId(): string;
    private updateInterval;
    setInterval(time: number): this;
    stop(): void;
    send(): void;
}
declare namespace Output {
    type Props = {
        remoteSystem: LoxoneRemoteSystem;
        packetId: string;
    };
}

declare class AnalogOutput extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): boolean;
    setValue(value: number): this;
    getValue(): number;
}

declare class DigitalOutput extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): value is boolean;
    setValue(value: boolean): this;
    private triggerValue;
    /** triggers the current value high and then sets it back to 0 after a given time */
    triggerHigh(time?: number): void;
    /** triggers the current value low and then sets it back to 0 after a given time */
    triggerLow(time?: number): void;
    getValue(): boolean;
}

declare class T5Output extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): boolean;
    setValue(props: T5Payload.Type): this;
    getValue(): T5Payload.Type;
}

declare class TextOutput extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): value is string;
    setValue(value: string): this;
    getValue(): string;
}

declare class SmartRGBWOutput extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): boolean;
    setPartial(props: Partial<SmartRGBWPayload.Type>): this;
    setValue(props: SmartRGBWPayload.Type): this;
    getValue(): SmartRGBWPayload.Type;
}

declare class SmartActuatorSingleChannelOutput extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): boolean;
    setPartial(props: Partial<SmartActuatorSingleChannelPayload.Type>): this;
    setValue(props: SmartActuatorSingleChannelPayload.Type): this;
    getValue(): SmartActuatorSingleChannelPayload.Type;
}

interface LoxoneRemoteSystem extends EventEmitter {
    on(eventName: "error", listener: (error: Error) => void): this;
    emit(eventName: "error", error: Error): boolean;
}
declare class LoxoneRemoteSystem extends EventEmitter {
    readonly props: LoxoneRemoteSystem.Props;
    private socket;
    private outputs;
    private connectedResolve;
    constructor(props: LoxoneRemoteSystem.Props);
    close(): Promise<void>;
    /**
     * server instance the remote system belongs to
     */
    get server(): LoxoneServer;
    /**
     * ownId which is being sent to the remote miniserver
     */
    get ownId(): string;
    /**
     * remoteId which has been set on the remote miniserver
     */
    get remoteId(): string;
    /**
     * fetches the output with the given packetId
     * if no packetId has been previously created and no type has been given it throws an error
     * if no packetId has been previously created but a type has been set, then the output will be created
     * @param packetId name of the packetId to identify it inside the loxone miniserver
     * @param type the type of the packet
     * @returns
     */
    get(packetId: string, type?: DATA_TYPE): Output;
    /**
     * finds an output by the packetId in the output list
     * @param packetId name to find
     * @returns
     */
    private findOutput;
    /**
     * creates a new output which is sendable to the miniserver
     * @param packetId name of the output
     * @param type type of the output
     */
    createOutput(packetId: string, type: DATA_TYPE.DIGITAL): DigitalOutput;
    createOutput(packetId: string, type: DATA_TYPE.ANALOG): AnalogOutput;
    createOutput(packetId: string, type: DATA_TYPE.TEXT): TextOutput;
    createOutput(packetId: string, type: DATA_TYPE.T5): T5Output;
    createOutput(packetId: string, type: DATA_TYPE.SmartActuatorRGBW): SmartRGBWOutput;
    createOutput(packetId: string, type: DATA_TYPE.SmartActuatorSingleChannel): SmartActuatorSingleChannelOutput;
    createOutput(packetId: string, type: DATA_TYPE): Output;
    createDigitalOutput(packetId: string): DigitalOutput;
    createAnalogOutput(packetId: string): AnalogOutput;
    createTextOuput(packetId: string): TextOutput;
    createT5Output(packetId: string): T5Output;
    createSmartActuatorRGBWOutput(packetId: string): SmartRGBWOutput;
    createSmartActuatorSingleChannelOutput(packetId: string): SmartActuatorSingleChannelOutput;
    /**
     * sends the data without maintaining a cyclic interval sending
     * @param packetId name of the output
     * @param type type of the output
     */
    sendOnce(packetId: string, type: DATA_TYPE.DIGITAL): DigitalOutput;
    sendOnce(packetId: string, type: DATA_TYPE.ANALOG): AnalogOutput;
    sendOnce(packetId: string, type: DATA_TYPE.TEXT): TextOutput;
    sendOnce(packetId: string, type: DATA_TYPE.T5): T5Output;
    sendOnce(packetId: string, type: DATA_TYPE.SmartActuatorRGBW): SmartRGBWOutput;
    sendOnce(packetId: string, type: DATA_TYPE.SmartActuatorSingleChannel): SmartActuatorSingleChannelOutput;
    sendOnce(packetId: string, type: DATA_TYPE.T5): T5Output;
    sendOnce(packetId: string, type: DATA_TYPE): Output;
    /**
     * creates the instance object of the output
     * @param packetId name of the output
     * @param type type of the output
     * @returns
     */
    private createOutputInstance;
    /**
     *
     */
    private matchesOutputInstance;
    /**
     * sends the output to the miniserver
     * @param output
     */
    send(output: Output): void;
    /**
     * sends the buffer to the miniserver
     * @param buffer
     * @returns
     */
    private sendBuffer;
}
declare namespace LoxoneRemoteSystem {
    type Props = {
        remoteId: string;
        address: string;
        port: number;
        server: LoxoneServer;
        suppressECONNREFUSED?: boolean;
    };
    type SendValue = number | boolean | string;
}

declare class LoxoneInput extends LoxoneIOPacket {
    readonly buffer: Buffer;
    private _payload?;
    constructor(buffer: Buffer);
    get sourceId(): string;
    get targetId(): string;
    get packetId(): string;
    get payloadLength(): number;
    get type(): number;
    get dataType(): number;
    private get payloadBuffer();
    get payload(): Payload;
    /**
     * checks if the payload buffer is equal to the payload of another packet
     * @param packet the packet to compare the payload to
     * @returns
     */
    equals(packet: LoxoneInput): boolean;
    toBuffer(): Buffer<ArrayBuffer>;
    private createPayload;
}

declare class SmartActuatorTunableWhitePayload extends Payload {
    /** temperature in kelvin */
    get temperature(): number;
    /** brightness in % */
    get brightness(): number;
    get fadeTime(): number;
    get value(): SmartActuatorTunableWhitePayload.Type;
    static bufferFromValue(data: Buffer): Buffer<ArrayBuffer>;
}
declare namespace SmartActuatorTunableWhitePayload {
    type Type = {
        /** temperature in kelvin */
        temperature: number;
        /** brightness in % */
        brightness: number;
        /** fadeTime in seconds */
        fadeTime: number;
    };
}

declare class LoxoneInputListener {
    readonly id: string | RegExp;
    private listeners;
    private lastValue;
    constructor(id: string | RegExp);
    private addListener;
    private execListener;
    digital(cb: LoxoneInputListener.DigitalCallbackHandler): number;
    risingEdge(cb: LoxoneInputListener.DigitalCallbackHandler): number;
    fallingEdge(cb: LoxoneInputListener.DigitalCallbackHandler): number;
    analog(cb: LoxoneInputListener.AnalogCallbackHandler): number;
    text(cb: LoxoneInputListener.TextCallbackHandler): number;
    smartRgbw(cb: LoxoneInputListener.SmartRGBWCallbackHandler): number;
    smartActuatorSingleChannel(cb: LoxoneInputListener.SmartActuatorSingleChannelCallbackHandler): number;
    smartActuatorTunableWhite(cb: LoxoneInputListener.SmartActuatorSingleChannelCallbackHandler): number;
    receive({ type, payload }: LoxoneInput): void;
    /** checks if the input is exactly the same (type and regex) as the set id */
    matchExact(id: string | RegExp): boolean;
    /** validates and checks if the input matches the id of the input listener */
    match(id: string): boolean;
}
declare namespace LoxoneInputListener {
    type ListenerDict = {
        digital: DigitalCallbackHandler[];
        risingEdge: DigitalCallbackHandler[];
        fallingEdge: DigitalCallbackHandler[];
        analog: AnalogCallbackHandler[];
        text: TextCallbackHandler[];
        t5: T5CallbackHandler[];
        smartRgbw: SmartRGBWCallbackHandler[];
        smartActuatorSingleChannel: SmartActuatorSingleChannelCallbackHandler[];
        smartActuatorTunableWhite: SmartActuatorTunableWhiteCallbackHandler[];
    };
    type CallbackHandler<T> = (value: T) => void;
    type DigitalCallbackHandler = CallbackHandler<boolean>;
    type AnalogCallbackHandler = CallbackHandler<number>;
    type TextCallbackHandler = CallbackHandler<string>;
    type T5CallbackHandler = CallbackHandler<T5Payload.Type>;
    type SmartRGBWCallbackHandler = CallbackHandler<SmartRGBWPayload.Type>;
    type SmartActuatorSingleChannelCallbackHandler = CallbackHandler<SmartActuatorSingleChannelPayload.Type>;
    type SmartActuatorTunableWhiteCallbackHandler = CallbackHandler<SmartActuatorTunableWhitePayload.Type>;
    type Unpack<T> = T extends (infer U)[] ? U : T;
}

interface LoxoneServer extends EventEmitter {
    on(eventName: "data", listener: (props: LoxoneServer.DataEvent) => void): this;
    on(eventName: "input", listener: (props: LoxoneServer.InputEvent) => void): this;
    emit(eventName: "data", props: LoxoneServer.DataEvent): boolean;
    /**
     * receives inputs from the miniserver
     * @param eventName
     * @param props
     */
    emit(eventName: "input", props: LoxoneServer.InputEvent): boolean;
}
declare class LoxoneServer extends EventEmitter {
    readonly props: LoxoneServer.Props;
    readonly server: dgram.Socket;
    private inputs;
    private received;
    constructor(props?: LoxoneServer.Props);
    /**
     * ownId which is being sent to the miniserver for identification purposes
     */
    get ownId(): string;
    get emitInputMode(): LoxoneServer.EmitInputEventMode;
    /**
     * creates a new remote system which sends inputs and
     * receives output from a loxone server
     * @param remoteId
     * @returns
     */
    createRemoteSystem(props: Omit<LoxoneRemoteSystem.Props, "server">): LoxoneRemoteSystem;
    /**
     * creates a new input listener
     */
    inputListener(id: string): LoxoneInputListener;
    /**
     * listens to the specified port and optional bind address
     * @param port port to listen to
     * @param address set the address to listen to, by default listens on all interfaces
     * @returns
     */
    bind(port: number, address?: string): Promise<void>;
    /**
     * closes the bound port
     */
    close(): Promise<void>;
    /**
     * identifies the packet and returns the correct class instance
     * @param buffer
     * @returns
     */
    static packetFromBuffer(buffer: Buffer): LoxoneUDPPacket | void;
}
declare namespace LoxoneServer {
    type Props = {
        ownId?: string;
        emitInputMode?: EmitInputEventMode;
    };
    type EmitInputEventMode = "all" | "change";
    type DataEvent = {
        rinfo: dgram.RemoteInfo;
        packet: LoxoneUDPPacket;
    };
    type InputEvent = {
        rinfo: dgram.RemoteInfo;
        packet: LoxoneInput;
    };
}

declare class OutputTypeError extends Error {
    readonly output: Output;
    readonly value: any;
    constructor(output: Output, value: any);
}

declare class BufferPacket extends LoxoneUDPPacket {
    readonly buffer: Buffer;
    constructor(buffer: Buffer);
    get controlByte(): number;
    toBuffer(): Buffer<ArrayBufferLike>;
}

export { AnalogOutput, BufferPacket, DATA_TYPE, DigitalOutput, LoxoneIOPacket, LoxoneInput, LoxoneOutput, LoxoneRemoteSystem, LoxoneServer, LoxoneUDPPacket, OutputTypeError, SmartActuatorSingleChannelOutput, SmartRGBWOutput, T5Output, TextOutput };
