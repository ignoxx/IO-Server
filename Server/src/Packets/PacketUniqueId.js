const Packet = require('./Packet.js')

class PacketUniqueId extends Packet{
    static getPacketId() {
        return Packet.getNetOP().UniqueId;
    }
    
    constructor(){
        super();

        this.uniqueId;
    }
}

module.exports = PacketUniqueId;