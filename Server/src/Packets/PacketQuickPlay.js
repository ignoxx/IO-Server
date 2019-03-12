const Packet = require('./Packet.js')

class PacketQuickPlay extends Packet{
    static getPacketId() {
        return Packet.getNetOP().QuickPlay;
    }

    constructor(){
        super();

        this.player;
    }
}

module.exports = PacketQuickPlay;