const Packet = require('./Packet.js')
const packetID = Packet.getNetOP().QuickPlay;

class PacketQuickPlay extends Packet{
    constructor(){
        super();

        this.packetID = packetID;
        this.username;
        this.player;
    }
}

module.exports = PacketQuickPlay;