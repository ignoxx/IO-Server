const Packet = require('./Packet.js')

class PacketSessionId extends Packet{
    static getPacketId() {
        return Packet.getNetOP().SessionId;
    }
    
    constructor(){
        super();

        this.sessionId;
        this.uniqueId;
    }
}

module.exports = PacketSessionId;