const Packet = require('./Packet.js')

class PacketQuickPlay extends Packet{
    constructor(){
        super();

        this.eventName = Packet.getEventName().QuickPlay;
        this.player;
    }

    setData(Player) {
        this.player = Player;

        return this;
    }
}

module.exports = PacketQuickPlay;