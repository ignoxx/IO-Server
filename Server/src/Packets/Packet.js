const NetOP = {
    None: 'none',
    Register: 'register',
    QuickPlay: 'quick_play',
    SessionId:  'session_id',
    Disconnect: 'logout'
};


class Packet {
    static getNetOP(){
        return NetOP;
    }
}

module.exports = Packet;