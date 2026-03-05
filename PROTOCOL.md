# Loxone Intercommunication Protocol

All multi-byte values are encoded in **Little Endian** unless stated otherwise.

## Packet types

<details>
  <summary>0x9E Output Data Packet</summary>
  
  Example packet:

  ```
  00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45
  9e 00 00 00 00 00 00 00 73 65 72 76 65 72 00 00 00 72 65 6d 6f 74 65 00 00 00 61 6e 61 6c 6f 67 00 00 00 08 00 01 00 00 00 20 d2 6f f0 bf
  ```

  ---

  ## Packet Layout

  | Offset | Size | Field       | Description                                              |
  |--------|------|-------------|----------------------------------------------------------|
  | **HEADER**                                                                             |
  | 0      | 1    | Packet Type | `0x9E` when plain IO output is sent                      |
  | 1–7    | 7    | Unknown     | Purpose currently unknown                                |
  | 8–15   | 8    | Own ID      | Configured under **Network Intercommunication → Own ID** |
  | 16     | 1    | Unknown     | Always `0x00` (observed)                                 |
  | 17–24  | 8    | Target ID   | Configured as **ID of the Remote System**                |
  | 25     | 1    | Unknown     | Always `0x00` (observed)                                 |
  | **BODY**                                                                               |
  | 26–34  | 8    | Packet ID   | Identifier of the output defined on the remote system    |
  | 34     | 1    | Unknown     | Always `0x00` (observed)                                 |
  | 35–36  | 2    | Data Length | Length of payload                                        |
  | 37     | 1    | Data Type   | Type of transmitted value                                |
  | 38..n  | var  | Payload     | Data depending on type                                   |

  ---
</details>


<details>
  <summary>0x9F Encrypted Output Data Packet</summary>

  Example packet:

  ```
  00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58
  9f 00 00 00 00 00 00 00 73 65 72 76 65 72 00 00 00 6e 65 78 75 73 00 00 00 00 02 9c bd db 6a 55 51 5f 2d 36 e0 c8 5b 2d 6b 17 71 44 21 54 86 22 6c 63 26 c2 8f dc ca 8e cf af 50
  ```

  ---

  ## Packet Layout

  | Offset | Size | Field       | Description                                                 |
  |--------|------|-------------|-------------------------------------------------------------|
  | **HEADER**                                                                                |
  | 0      | 1    | Packet Type | `0x9E` when plain IO output is sent                         |
  | 1–7    | 7    | Unknown     | Purpose currently unknown                                   |
  | 8–15   | 8    | Own ID      | Configured under **Network Intercommunication → Own ID**    |
  | 16     | 1    | Unknown     | Always `0x00` (observed)                                    |
  | 17–24  | 8    | Target ID   | Configured as **ID of the Remote System**                   |
  | 25     | 1    | Unknown     | Always `0x00` (observed)                                    |
  | **BODY**                                                                                  |
  | 26     | 1    | AES Blocks  | amount of AES Blocks following n*16 bytes                   |
  | 27     | 1    | IV          | first AES block which also stores the initialization vector |
  | 37..n  | var  | Payload     | Type of transmitted value                                   |

  ### Decrypted Content

  | Offset | Size | Field       | Description                                                 |
  |--------|------|-------------|-------------------------------------------------------------|
  | BODY                                                                                      |
  | 0–8    | 8    | Packet ID   | Identifier of the output defined on the remote system       |
  | 8      | 1    | Unknown     | Always `0x00` (observed)                                    |
  | 9–10   | 2    | Data Length | Length of payload                                           |
  | 11     | 1    | Unknown     | Always `0x00` (observed)                                    |
  | 12..n  | var  | Payload     | Data depending on the type                                  |

</details>

<details>
  <summary>0x8D Status Packet</summary>

  This packet is sent cyclically every **~7 minutes**.

  Example:

  ```
  00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
  8d 00 00 00 eb 23 a2 94 73 65 72 76 65 72 00 00 00 00 00 00 00 00 00 00 00 00 00 00 64
  ```

  | Offset | Size | Description              |
  |--------|------|--------------------------|
  | 0      | 1    | Packet Type (`0x8D`)     |
  | 1–7    | 7    | Unknown                  |
  | 8–15   | 8    | Loxone Miniserver Name   |
  | 16..n  | var  | Unknown fields           |

  Purpose of the remaining data is currently unknown.

</details>



## Data Types

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

### Payload Formats

<details>
  <summary>DIGITAL</summary>
  | Size   | Type  | Description |
  |--------|-------|-------------|
  | 1 byte | UINT8 | `0` or `1`  |
</details>

<details>
  <summary>ANALOG</summary>
  | Size    | Type        | Description           |
  |---------|-------------|-----------------------|
  | 8 bytes | Double (LE) | Floating point value  |
</details>


<details>
  <summary>TEXT</summary>
  | Size     | Type         | Description              |
  |----------|--------------|--------------------------|
  | variable | UTF-8 string | Null terminated (`0x00`) |
</details>


<details>
  <summary>T5</summary>
  | Size    | Type              |
  |---------|-------------------|
  | 8 bytes | Unknown structure |
</details>


<details>
  <summary>SmartActuatorRGBW</summary>
  Total size: **8 bytes**

  | Offset | Size | Description                           |
  |--------|------|---------------------------------------|
  | 0–3    | 4    | RGBW values (0–100)                   |
  | 4–5    | 2    | Fade time (UINT16) in **0.1 seconds** |
  | 6–7    | 2    | Unknown                               |
</details>


<details>
  <summary>SmartActuatorSingleChannel</summary>
  Total size: **8 bytes**

  | Offset | Size | Description                           |
  |--------|------|---------------------------------------|
  | 0–2    | 3    | Unknown                               |
  | 3      | 1    | Channel value                         |
  | 4–5    | 2    | Fade time (UINT16) in **0.1 seconds** |
</details>


<details>
  <summary>SmartActuatorTunableWhite</summary>
  Total size: **8 bytes**

  | Offset | Size | Description                             |
  |--------|------|-----------------------------------------|
  | 0–1    | 2    | Color temperature (Kelvin)              |
  | 2–3    | 2    | Brightness (%)                          |
  | 4–5    | 2    | Fade time (UINT16) in **0.2 seconds**   |
  | 6–7    | 2    | Unknown                                 |
</details>


## Encryption

Packets may optionally be encrypted and uses **AES-128-CBC**

<details>
  <summary>Key Derivation</summary>

  The encryption key is derived from the password:

  ```
  key = SHA256(password)[0..15]
  ```

  The **first 16 bytes** of the SHA-256 hash are used as the AES key.

</details>


<details>
  <summary>Encrypted Packet Body</summary>
  At **byte offset 26**, the header specifies the number of **AES blocks (16 bytes each)** contained in the encrypted section.

  **Important**

  - The value represents the **total number of AES blocks**
  - The encrypted section always contains **at least 2 blocks**

  | Block      | Description                  |
  |------------|------------------------------|
  | Block 0    | Initialization Vector (IV)   |
  | Block 1..n | Encrypted payload            |

  After decryption, the payload structure matches the **unencrypted packet format**, except that the **data type field is not included**.

</details>
<details>
  <summary>Decryption Process</summary>

  1. Read the **block count** from offset `26`.
  2. Extract the encrypted section:

  ```
  block_count * 16 bytes
  ```

  3. Use the **first 16 bytes** as the **IV**.
  4. Decrypt the remaining blocks using **AES-128-CBC** and the derived key.
</details>