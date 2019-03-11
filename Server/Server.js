const server = require('http').createServer();
const io = require('socket.io')(server);

const Player = require('./src/Player.js');
const World = require('./src/World.js');

const PacketQuickPlay = require('./src/Packets/PacketQuickPlay.js');
const PacketSessionId = require('./src/Packets/PacketSessionId.js');
const PacketDisconnect = require('./src/Packets/PacketDisconnect.js');

const port = 5000;
const playerTimeOut = 30; //seconds

var gameWorld;

// Listen for incoming connections
server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on port.. > ${port}`);

    // Create game world(s)
    gameWorld = new World();
});


io.on('connection', (client) => {
    console.log(`Incoming connection.. > ${client.id}`);

    var player;

    // #region Tell client his session id
        let packetSessionId = new PacketSessionId();
        packetSessionId.sessionId = client.id;
        packetSessionId.uniqueId = Math.random().toString(36).substring(3,16) + +new Date;
        client.emit(packetSessionId.getPacketId(), JSON.stringify(packetSessionId));
        console.log(packetSessionId);
    // #endregion

    // QuickPlay
    client.on(PacketQuickPlay.getPacketId(), (data) => {
        data = JSON.parse(data);

        // #region User input checking
            if (data.username.length <= 0) return;

            // Remove illegal characters
            data.username = data.username.replace(/([^a-z0-9]+)/gi, '-');
        // #endregion

        // Check if player already exists

        player = new Player({
            id: client.id,
            addr: client.handshake.address,
            socket: client,
            
            username: data.username,
        });

        if (gameWorld.addPlayer(player)) {
            // #region Send packet
                let packetQuickPlay = new PacketQuickPlay();
                packetQuickPlay.player = player;

                //Send to all, including ourself
                io.emit(packetQuickPlay.getPacketId(), JSON.stringify(packetQuickPlay));
            // #endregion

            console.log(`${player.username} connected.. > ${player.id}`);
        }
        else {
            console.log(`${player.username} tried to connect.. > connection was rejected`);
        }

        

    });

    client.on('disconnect', (data) => {
        console.log(`Client '${client.id}' disconnected`);

        setTimeout(() => {
            if (player.loggedIn) {
                gameWorld.removePlayer(player);
                // #region Send packet 
                    packetDisconnect = new PacketDisconnect();
                    packetDisconnect.sessionId = client.id;
                    client.broadcast.emit(packetDisconnect.getPacketId(), JSON.stringify(packetDisconnect));
                // #endregion

                console.log(`Player '${player.username}' timed out`);
            }
        }, playerTimeOut * 1000);
    });
});