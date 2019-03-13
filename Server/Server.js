const server = require('http').createServer();
const io = require('socket.io')(server);
const chalk = require('chalk');

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
    console.log(chalk.green(`Listening on port.. > ${port}`));
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



    client.on(PacketQuickPlay.getPacketId(), (data) => {
        data = JSON.parse(data);

        // #region User input checking
        if (data.username.length <= 0) return;

        // Remove illegal characters
        data.username = data.username.replace(/([^a-z0-9]+)/gi, '-');

        if(player !== undefined) {
            console.log(chalk.red(`player ${player.id} already exists, packet rejected`));
            return;
        }
        // #endregion

        // if this client has a uniqueId, restore his player data, if available otherwise create a new one
        if (data.uniqueId != "undefined") {
            let fullUniqueId = `${data.uniqueId}${client.handshake.address}`;

            if (gameWorld.findPlayerByUid(fullUniqueId) && player === undefined) {
                player = gameWorld.getPlayer(fullUniqueId);

                console.log(chalk.green("Player restored.. > " + player.uid));
            }
            else {
                uniqueId = data.uniqueId;
            }
        }

        // create a fresh new player
        if (player === undefined) {

            player = new Player({
                id: client.id,
                uid: `${uniqueId}${client.handshake.address}`,

                addr: client.handshake.address,
                socket: client,

                username: data.username,
            });

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
                console.log(chalk.red(`${player.username} tried to connect.. > connection was rejected`));
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

                console.log(chalk.yellow(`Player '${player.username}' timed out`));
            }
        }, playerTimeOut * 1000);
    });
});