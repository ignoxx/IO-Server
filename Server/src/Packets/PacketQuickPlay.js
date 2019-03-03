const Packet = require('./Packet.js')
const packetID = Packet.getNetOP().QuickPlay;

class PacketQuickPlay extends Packet{
    constructor(){
        super();

        this.packetID = packetID;
        this.player;
    }
}

module.exports = PacketQuickPlay;