const Packet = require('./Packet.js')

class PacketDisconnect extends Packet{
    static getPacketId() {
        return Packet.getNetOP().Disconnect;
    }
    
    constructor(){
        super();
        this.sessionId;
    }
}

module.exports = PacketDisconnect;