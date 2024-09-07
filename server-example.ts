import dgram from "dgram"
import { LoxoneUDPPacket } from "./src/packet/LoxoneUDPPacket"


const server = dgram.createSocket("udp4")
server.on("message", (buffer, rinfo) => {
  const packet = new LoxoneUDPPacket(buffer)
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