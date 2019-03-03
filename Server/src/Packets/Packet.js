const NetOP = {
    None: 'none',
    Register: 'register',
    QuickPlay: 'quick_play',
    SessionId:  'session_id',
}

class Packet {
    static getNetOP(){
        return NetOP;
    }

    constructor(){
        this.packetID = NetOP.None;
    };

    static getPacketID(){
        return this.packetID;
    }
}

module.exports = Packet;