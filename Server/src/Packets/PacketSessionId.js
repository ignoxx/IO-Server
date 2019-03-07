const Packet = require('./Packet.js')

class PacketSessionId extends Packet{
    static getPacketId() {
        return Packet.getNetOP().SessionId;
    }
    
    constructor(){
        super();

        this.packetID = Packet.getNetOP().SessionId;
        this.sessionId;
    }
}

module.exports = PacketSessionId;