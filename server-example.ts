import { LoxoneUDPServer } from "./src/LoxoneServer"


const server = new LoxoneUDPServer()

server.on("data", ({ packet }) => {
  console.log({
    packet,
    sourceId: packet.sourceId,
    targetId: packet.targetId,
    packetId: packet.packetId,
    payloadLength: packet.payloadLength,
    type: packet.type,
    payload: packet.payload.value
  })
})

server.bind(61263)