import { LoxoneServer } from "./src/LoxoneServer"
import { DATA_TYPE } from "./src/packet/DataType"
import { LoxoneInput } from "./src/packet/LoxoneInput"


const server = new LoxoneServer({ ownId: "remote" })

server.bind(61263).then(() => {
  const remote = server.createRemoteSystem({
    remoteId: "server",
    address: "10.10.10.205",
    port: 61263
  })
  
  const output = remote.createOutput("foo", DATA_TYPE.ANALOG)
  const cyclic = remote.createOutput("cyclic", DATA_TYPE.DIGITAL)
  cyclic.setValue(true)
  let i = 0
  setInterval(() => output.setValue(i++), 1000)
  
  server.on("data", ({ packet }) => {
    if (!(packet instanceof LoxoneInput)) return
    let { value } = packet.payload
    if (typeof value === "object") value = JSON.stringify(value)
    console.log(`Receive packet id "${packet.packetId}" with type ${DATA_TYPE[packet.type]} and value ${value}`)
  })
  
  
})

