const NetOP = {
    None: 'none',
    Register: 'register',
    QuickPlay: 'quick_play',
    SessionId: 'session_id',
    Disconnect: 'logout',
    UniqueId: 'unique_id'
};


class Packet {
    static getNetOP() {
        return NetOP;
    }

    getPacketData() {
        return JSON.stringify(this);
    }
}

module.exports = Packet;