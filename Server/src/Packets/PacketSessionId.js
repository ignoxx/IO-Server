const Packet = require('./Packet.js')

class PacketSessionId extends Packet{    
    constructor(){
        super();

        this.eventName = Packet.getEventName().SessionId;
        this.sessionId;
    }

    setData(sessionId) {
        this.sessionId = sessionId;

        return this;
    }
}

module.exports = PacketSessionId;