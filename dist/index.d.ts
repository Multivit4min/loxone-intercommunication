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

declare class LoxoneIOPacket extends LoxoneUDPPacket {
    get controlByte(): number;
}

declare abstract class Payload {
    readonly buffer: Buffer;
    constructor(buffer: Buffer);
    abstract get value(): any;
    get byteLength(): number;
}

declare class SmartActuatorSingleChannelPayload extends Payload {
    get channel(): number;
    get fadeTime(): number;
    get value(): SmartActuatorSingleChannelPayload.Type;
    static bufferFromValue(data: SmartActuatorSingleChannelPayload.Type): Buffer;
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
    static bufferFromValue(data: SmartRGBWPayload.Type): Buffer;
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
    static bufferFromValue({ button }: T5Payload.Type): Buffer;
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
    toBuffer(): Buffer;
    private createPayload;
    static createPayloadBuffer({ type, value }: LoxoneOutput.PayloadDataType): Buffer;
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
    getValue(): boolean;
}

declare class T5Output extends Output {
    private value;
    setValueFromString(value: string): this;
    isTypeValid(value: any): any;
    setValue(button: T5Payload.ButtonPressed): this;
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

declare class LoxoneRemoteSystem extends EventEmitter {
    readonly props: LoxoneRemoteSystem.Props;
    private socket;
    private outputs;
    private connectedResolve;
    constructor(props: LoxoneRemoteSystem.Props);
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
    createOutput(packetId: string, type: DATA_TYPE.T5): T5Output;
    createOutput(packetId: string, type: DATA_TYPE): Output;
    /**
     * creates the instance object of the output
     * @param packetId name of the output
     * @param type type of the output
     * @returns
     */
    private createOutputInstance;
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
    private get payloadBuffer();
    get payload(): Payload;
    toBuffer(): Buffer;
    private createPayload;
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
    constructor(props?: LoxoneServer.Props);
    /**
     * ownId which is being sent to the miniserver for identification purposes
     */
    get ownId(): string;
    /**
     * creates a new remote system which sends inputs and
     * receives output from a loxone server
     * @param remoteId
     * @returns
     */
    createRemoteSystem(props: Omit<LoxoneRemoteSystem.Props, "server">): LoxoneRemoteSystem;
    /**
     * listens to the specified port and optional bind address
     * @param port port to listen to
     * @param address set the address to listen to, by default listens on all interfaces
     * @returns
     */
    bind(port: number, address?: string): Promise<void>;
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
    };
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
    toBuffer(): Buffer;
}

export { AnalogOutput, BufferPacket, DATA_TYPE, DigitalOutput, LoxoneIOPacket, LoxoneInput, LoxoneOutput, LoxoneRemoteSystem, LoxoneServer, LoxoneUDPPacket, OutputTypeError, SmartActuatorSingleChannelOutput, SmartRGBWOutput, T5Output, TextOutput };
