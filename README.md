Loxone Intercommunication
=========================

This Library aims to provide a Interface which can communicate with a Loxone Miniserver over its integrated Loxone Intercommunication Interface, this allows to easy create Inputs and Outputs to send data between Loxone and your NodeJS Application.

Limitations
-----------

`ownId` `remoteId` and `packetId` has a character limitation of a maximum of **8** chars


Example
-------

```typescript
import { LoxoneServer } from "./src/LoxoneServer"
import { DATA_TYPE } from "./src/packet/DataType"

//create a instance with an id which is able to receive data
const server = new LoxoneServer({ ownId: "remote" })

//this will enable udp data to be received on port 61263 (default port for loxone miniservers)
//this is also optional, there is no need to bind any port if you do not need to receive data
server.bind(61263)

//creates a remote system to send data to another miniserver
const remote = server.createRemoteSystem({
  remoteId: "server",
  address: "192.168.1.100",
  port: 61263
})

//creates new sendable outputs
//creates a new output which is able to send numeric values
const output = remote.createOutput("foo", DATA_TYPE.ANALOG)
//creates a new output which is able to send bool values
const cyclic = remote.createOutput("cyclic", DATA_TYPE.DIGITAL)

//send output once and by default the output will be repeateadly sent every 10 seconds
//as soon as set value has been called the output will be sent to the miniserver
cyclic.setValue(true)

//update the output every second
let i = 0
setInterval(() => output.setValue(i++), 1000)

//receive data from the loxone miniserver
server.on("input", ({ packet }) => {
  let { value } = packet.payload
  if (typeof value === "object") value = JSON.stringify(value)
  console.log(`Receive packet id "${packet.packetId}" with type ${DATA_TYPE[packet.type]} and value ${value}`)
})

```