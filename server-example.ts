import { LoxoneServer } from "./src/LoxoneServer"
import { DATA_TYPE } from "./src/packet/DataType"
import { LoxoneIOPacket } from "./src/packet/LoxoneIOPacket"


const server = new LoxoneServer({ ownId: "remote" })

const remote = server.createRemoteSystem({
  remoteId: "server",
  address: "10.10.10.205",
  port: 61263
})

server.on("data", ({ packet }) => {
  if (!(packet instanceof LoxoneIOPacket)) return
  let { value } = packet.payload
  if (typeof value === "object") value = JSON.stringify(value)
  console.log(`Receive packet id "${packet.packetId}" with type ${DATA_TYPE[packet.type]} and value ${value}`)
  //echo the packet back to the miniserver
  //remote.send(packet.packetId, packet.payload.value)
})

server.bind(61263)

