const server = require('http').createServer();
const io = require('socket.io')(server);

const Player = require('./src/Player.js');
const World = require('./src/World.js');

const PacketQuickPlay = require('./src/Packets/PacketQuickPlay.js');
const PacketSessionId = require('./src/Packets/PacketSessionId.js');
const PacketDisconnect = require('./src/Packets/PacketDisconnect.js');
const PacketUniqueId = require('./src/Packets/PacketUniqueId.js');

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
    var uniqueId = Math.random().toString(36).substring(3, 16) + +new Date;

    // #region Tell client his session id and unique id
    let packetSessionId = new PacketSessionId();
    packetSessionId.sessionId = client.id;
    client.emit(PacketSessionId.getPacketId(), packetSessionId.getPacketData());
    // #endregion

    // QuickPlay
    client.on(PacketQuickPlay.getPacketId(), (data) => {
        console.log("quickplay packet received: " + data);
        data = JSON.parse(data);

        // #region User input checking
        if (data.username.length <= 0) return;

        // Remove illegal characters
        data.username = data.username.replace(/([^a-z0-9]+)/gi, '-');
        // #endregion

        // if this client has a uniqueId, restore his player data, if available
        // else create a new one
        if (data.uniqueId != "undefined") {
            let fullUniqueId = `${data.uniqueId}${client.handshake.address}`;

            console.log("received full uid: " + fullUniqueId);
            console.log("current players in world: " + gameWorld.getPlayerDict());

            if (gameWorld.findPlayerByUid(fullUniqueId)) {
                player = gameWorld.getPlayer(fullUniqueId);

                console.log("Returning player " + player.uid);
            }
            else {
                console.log("Returning player but invalid uniqueId.. creating a new one..");
            }
        }


        if (player === undefined) {
            // create a new fresh player
            player = new Player({
                id: client.id,
                uid: `${uniqueId}${client.handshake.address}`,

                addr: client.handshake.address,
                socket: client,

                username: data.username,
            });

            console.log("creating player.., uid: " + player.uid);

            // #region send packet: tell client his new uniqueId
            let packetUniqueId = new PacketUniqueId();
            packetUniqueId.uniqueId = uniqueId;
            client.emit(PacketUniqueId.getPacketId(), packetUniqueId.getPacketData());
            // #endregion

            if (gameWorld.addPlayer(player)) {
                // #region Send packet
                let packetQuickPlay = new PacketQuickPlay();
                packetQuickPlay.player = player;
    
                //Send to all, including ourself
                io.emit(PacketQuickPlay.getPacketId(), packetQuickPlay.getPacketData());
                // #endregion
    
                console.log(`${player.username} connected.. > ${player.id}`);
            }
            else {
                console.log(`${player.username} tried to connect.. > connection was rejected`);
            }
        }

        player.connected = true;
    });

    client.on('disconnect', (data) => {
        player.connected = false;

        console.log(`Client '${client.id}' disconnected`);

        setTimeout(() => {
            if (player.loggedIn && !player.connected) {
                gameWorld.removePlayer(player);
                // #region Send packet 
                packetDisconnect = new PacketDisconnect();
                packetDisconnect.sessionId = player.uid;
                client.broadcast.emit(PacketDisconnect.getPacketId(), packetDisconnect.getPacketData());
                // #endregion

                console.log(`Player '${player.username}' timed out`);
            }
        }, playerTimeOut * 1000);
    });
});