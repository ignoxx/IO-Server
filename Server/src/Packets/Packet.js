const EVENT_NAME = {
    None: 'none',
    Register: 'register',
    QuickPlay: 'quick_play',
    SessionId: 'session_id',
    Disconnect: 'logout',
    UniqueId: 'unique_id'
};


class Packet {
    static getEventName() {
        return EVENT_NAME;
    }

    constructor() {
        this.eventName = EVENT_NAME.None;
    }

    getPacketData() {
        return JSON.stringify(this);
    }

    emit(socket) {
        socket.emit(this.eventName, this.getPacketData());

        return this;
    }

    broadcast(socket) {
        socket.broadcast.emit(this.eventName, this.getPacketData());
    }
}

module.exports = Packet;