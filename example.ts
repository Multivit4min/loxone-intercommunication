import { LoxoneServer } from "./src/LoxoneServer"
import { DATA_TYPE } from "./src/packet/DataType"

const server = new LoxoneServer({ ownId: "remote" })

server.bind(61263)

const remote = server.createRemoteSystem({
  remoteId: "server",
  address: "10.10.10.205",
  port: 61263
})

const output = remote.createOutput("foo", DATA_TYPE.ANALOG)
const cyclic = remote.createOutput("cyclic", DATA_TYPE.DIGITAL)

//send output once and by default the output will be resent every 10 seconds
cyclic.setValue(true)

//update the output every second
let i = 0
setInterval(() => output.setValue(i++), 1000)

server.on("input", ({ packet }) => {
  let { value } = packet.payload
  if (typeof value === "object") value = JSON.stringify(value)
  console.log(`Receive packet id "${packet.packetId}" with type ${DATA_TYPE[packet.type]} and value ${value}`)
})