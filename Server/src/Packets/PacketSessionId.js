const Packet = require('./Packet.js')

class PacketSessionId extends Packet{
    constructor(){
        super();
        this.packetID = Packet.getNetOP().SessionId;

        this.sessionId;
    }
}

module.exports = PacketRegister;