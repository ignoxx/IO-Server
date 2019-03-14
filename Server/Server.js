// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

const server = require('http').createServer();
const io = require('socket.io')(server);
const chalk = require('chalk');

const Player = require('./src/Player.js');
const World = require('./src/World.js');
const Client = require('./src/Client.js');

const Packet = require('./src/Packets/Packet.js');
const PacketQuickPlay = require('./src/Packets/PacketQuickPlay.js');
const PacketSessionId = require('./src/Packets/PacketSessionId.js');
const PacketDisconnect = require('./src/Packets/PacketDisconnect.js');
const PacketUniqueId = require('./src/Packets/PacketUniqueId.js');

const port = 5000;
const DEV_MODE = true;

var gameWorld;

// Listen for incoming connections
server.listen(port, (err) => {
    if (err) throw err;
    console.log(chalk.green(`Listening on port.. > ${port}`));
    gameWorld = new World();
});


io.on('connection', (client) => {
    console.log(`Incoming connection.. > '${client.id}'`);

    var clientHandler = new Client({
        socket: client
    });

    //Tell client his session id
    new PacketSessionId().setData(client.id).emit(client);


    client.on(Packet.getEventName().QuickPlay, (data) => {
        if (DEV_MODE) console.log(`Quickplay packet data: ${data}`);

        data = JSON.parse(data);

        data.username = clientHandler.formatUsername(data.username);

        if (clientHandler.playerExists()) {
            console.log(chalk.red(`Player '${clientHandler.player.id}' already exists, packet rejected`));
            return;
        }

        // if this client has a uniqueId, restore his player data
        if (clientHandler.isValidUniqueId(data.uniqueId)) {
            let fullUniqueId = clientHandler.getFullUniqueId(data.uniqueId);

            if (gameWorld.findPlayerByUid(fullUniqueId) && !clientHandler.playerExists()) {
                clientHandler.player = gameWorld.getPlayer(fullUniqueId);

                console.log(chalk.green(`Player restored.. > '${clientHandler.player.id}'`));
            }
            else {
                clientHandler.uniqueId = data.uniqueId;
            }
        }

        // create a fresh new player
        if (!clientHandler.playerExists()) {

            clientHandler.player = new Player({
                id: client.id,
                uid: `${clientHandler.uniqueId}${client.handshake.address}`,
                socket: client,

                username: data.username,
            });

            // tell client his new uniqueId
            new PacketUniqueId().setData(clientHandler.uniqueId).emit(client);

            if (gameWorld.addPlayer(clientHandler.player)) {

                //Respond to all clients, including ourself
                new PacketQuickPlay().setData(clientHandler.player).emit(io);

                console.log(`${clientHandler.player.username} connected.. > '${clientHandler.player.id}'`);
            }
            else {
                console.log(chalk.red(`Client '${client.id}' tried to connect.. > connection was rejected`));
            }
        }

        clientHandler.player.connected = true;
    });

    client.on('disconnect', (data) => {
        if(clientHandler.playerExists()) clientHandler.player.connected = false;

        console.log(`Client disconnected.. > '${client.id}'`);

        setTimeout(() => {
            if (clientHandler.isPlayerLoggedIn() && !clientHandler.isPlayerConnected()) {
                gameWorld.removePlayer(clientHandler.player);

                // Tell everyone, ourself not included
                new PacketDisconnect().setData(client.id).broadcast(client);

                console.log(chalk.yellow(`Player '${clientHandler.player.username}' timed out`));
            }
        }, clientHandler.playerTimeOut * 1000);
    });
});