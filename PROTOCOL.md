IO Data First Byte 0x9e
=======================

```
00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45
9e 00 00 00 00 00 00 00 73 65 72 76 65 72 00 00 00 72 65 6d 6f 74 65 00 00 00 61 6e 61 6c 6f 67 00 00 00 08 00 01 00 00 00 20 d2 6f f0 bf>
                        0  1  2  3  4  5  6  7     0  1  2  3  4  5  6  7     0  1  2  3  4  5  6  7  8  |  |  |  P  A  Y  L  O  A  D  ->
                        own id                     target id                  packet-id                  len p |
                                                                                                              type
``` 

General Data Encoding is in Little Endian format

Byte 0-7 Unknown
----------------
`Byte 0` is `9e` when plain output is sent from loxone


Byte 8-15 Own ID
----------------
Id which is being defined in Network Intercommunication inside the Loxone Config under `Own ID`


Byte 16 Unknown
---------------
Always `0` ?


Byte 17-24 Target ID
--------------------
Target Id which is defined when creating a remote system under `ID of the Remote System`


Byte 25 Unknown
---------------
Always `0` ?


Byte 26-34 Packet ID
--------------------
Packet Id which is defined when creating an output on the remote system


Byte 35+36 Data Length
-------------------
Length of Data Content in `UINT8` or `UINT16` Format

Byte 37 Data Type
-----------------
Data Type of the defined output
UINT8?

```typescript
export enum DATA_TYPE {
  DIGITAL = 0x00,
  ANALOG = 0x01,
  TEXT = 0x02,
  T5 = 0x03,
  SmartActuatorRGBW = 0x04,
  SmartActuatorSingleChannel = 0x05,
  SmartActuatorTunableWhite = 0x06
}
```

Byte 38+n
---------
Data Payload

> DIGITAL Payload

1 Byte > 0 or 1

> Analog Payload

8 Byte > Double LE

> Text Payload

UTF8 Encoded Text with last Byte `0x00`

> T5 Payload

8 Byte

> SmartRGBW Payload

8 Byte Total

4 Bytes RGBW Colors from 0 to 100\
2 Bytes UINT16 Fading Time in 0.1 Seconds\
2 Bytes Unknown Bits

> SmartActuatorSingleChannel Payload

8 Byte Total

3 Bytes Unknown\
1 Byte Channel Payload\
2 Bytes Fading Time in 0.1 Seconds


> SmartActuatorTunableWhite Payload

8 Byte Total

2 Bytes Color Temperature in Kelvin\
2 Bytes Brightness in %\
2 Bytes Fading Time in 0.2 Seconds\
2 Bytes Unknown

Unknown Data First Byte 0x8d
============================

Is being sent cyclic in 7 minute intervals

```
00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
8d 00 00 00 eb 23 a2 94 73 65 72 76 65 72 00 00 00 00 00 00 00 00 00 00 00 00 00 00 64
8d 00 00 00 eb 23 a2 94 73 65 72 76 65 72 00 00 00 00 00 00 00 00 00 00 00 00 00 00 64
8d 00 00 00 eb 23 a2 94 73 65 72 76 65 72 00 00 00 00 00 00 00 00 00 00 00 00 00 00 64
                        0  1  2  3  4  5  6  7
                        loxone miniserver name
```


# Encryption

Packets are encrypted using **AES-128 in CBC mode**.

The encryption key is derived from the user password by computing the SHA-256 hash and using the **first 16 bytes** of the result:
```
key = SHA256(password)[0..15]
```

## Packet Structure

The first 25 bytes are by default unencrypted which includes

- information that the packet is encrypted
- miniservers Id
- target Id


Encrypted packets contain an initialization vector (**IV**) followed by the encrypted payload.

At **byte offset 26**, the packet header specifies the number of **16-byte blocks** contained in the encrypted section.

**Important details:**

- The value represents the **total number of AES blocks**.
- The encrypted section always contains **at least 2 blocks**:
  - **Block 0** – Initialization Vector (**IV**)
  - **Block 1..n** – Encrypted payload data

## Decryption Process

1. Read the block count from **offset 26**.
2. Extract the encrypted section (`block_count × 16 bytes`).
3. Use the **first 16 bytes** as the IV.
4. Decrypt the remaining blocks using **AES-128-CBC** with the derived key.