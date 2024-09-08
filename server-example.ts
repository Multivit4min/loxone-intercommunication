import { LoxoneServer } from "./src/LoxoneServer"
import { DATA_TYPE } from "./src/packet/DataType"
import { LoxoneIOPacket } from "./src/packet/LoxoneIOPacket"
import { T5Payload } from "./src/packet/payload/T5Payload"


const server = new LoxoneServer({ ownId: "remote" })

const remote = server.createRemoteSystem({
  remoteId: "server",
  address: "10.10.10.205",
  port: 61263
})


server.on("data", ({ packet }) => {
  if (!(packet instanceof LoxoneIOPacket)) return
  //console.log({
  //  buffer: packet.toBuffer(),
  //  packet,
  //})
  //echo the packet back to the miniserver
  remote.send(packet.packetId, packet.payload.value)
})

server.bind(61263)

