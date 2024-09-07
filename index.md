Receive

```
00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40
9e 00 00 00 00 00 00 00 31 32 38 00 00 00 00 00 00 32 00 00 00 00 00 00 00 00 74 65 78 74 00 00 00 00 00 03 00 02 3a 29 00
                        0  1  2  3  4  5  6  7     0  1  2  3  4  5  6  7     0  1  2  3  4  5  6  7  8
                        own id                     target id                  packet-id

```

General Data Encoding is in Little Endian format

Byte 0-7 Unknown
----------------
`Byte 0` seems always to be `9e`


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


Byte 35+36? Data Length
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
  T5 = 0x03
  //Smart Actuator RGBW = 0x04
  //Smart Actuator Single Channel = 0x05
  //Smart Actuator Tunable White = 0x06
}
```

Byte 38+n
---------
Data Payload