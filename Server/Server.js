const server = require('http').createServer();
const io = require('socket.io')(server);

const Player = require('./src/Player.js');
const World = require('./src/World.js');

const PacketQuickPlay = require('./src/Packets/PacketQuickPlay.js');
const PacketSessionId = require('./src/Packets/PacketSessionId.js');

const port = 5000;

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
        client.emit(packetSessionId.getPacketId(), JSON.stringify(packetSessionId));
    // #endregion

    // QuickPlay
    client.on(PacketQuickPlay.getPacketId(), (data) => {
        data = JSON.parse(data);

        // #region User input checking
            if (data.username.length <= 0) return;

            // Remove illegal characters
            data.username = data.username.replace(/([^a-z0-9]+)/gi, '-');
        // #endregion

        player = new Player(
            client.id,
            client.handshake.address,
            
            data.username,
        );

        if (gameWorld.addPlayer(player)) {
            // #region Send packet
                let packetQuickPlay = new PacketQuickPlay();
                packetQuickPlay.player = player;
                
                client.emit(packetQuickPlay.getPacketId(), JSON.stringify(packetQuickPlay));
            // #endregion

            console.log(`${player.username} connected.. > ${player.id}`);
        }
        else {
            console.log(`${player.username} tried to connect.. > server is full`);
        }

        

    });

    client.on('disconnect', (data) => {
        if (player.loggedIn)
            console.log(`Player '${player.username}' disconnected`);
        else
            console.log(`Client '${client.id}' disconnected`);
    });
});