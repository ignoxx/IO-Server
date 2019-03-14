const Packet = require('./Packet.js')

class PacketRegister extends Packet{
    constructor(){
        super();

        this.eventName = Packet.getEventName().Register;

        this.username;
        this.password;
        this.email;
    }

    setData(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;

        return this;
    }
}

module.exports = PacketRegister;