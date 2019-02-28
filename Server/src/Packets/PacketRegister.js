const Packet = require('./Packet.js')

class PacketRegister extends Packet{
    constructor(){
        super();
        this.packetID = Packet.getNetOP().Register;

        this.username;
        this.password;
        this.email;
    }
}

module.exports = PacketRegister;