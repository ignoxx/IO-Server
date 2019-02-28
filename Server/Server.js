const server = require('http').createServer();
const io = require('socket.io')(server);
const port = 5000;
const maxPlayer = 64;

const Player = require('./src/Player.js');
const PacketQuickPlay = require('./src/Packets/PacketQuickPlay.js');
const PacketRegister = require('./src/Packets/PacketRegister.js');



// Listen for incoming connections
server.listen(port, (err) => {
    if (err) throw err
    console.log(`Listening on port.. ${port}`);
});


io.on('connection', (client) => {
    console.log('Incoming connection..');

    // #region Check if server is full
    if(Player.getPlayerList().length + 1 > maxPlayer){
        client.disconnect();
        console.log('Incoming connection closed. Server full');

        // TODO: Tell Client that server is full
    }
    // #endregion

    var loggedIn = false;
    var player;

    // 
    client.on(PacketQuickPlay.getPacketID(), (data) => {
        data = JSON.parse(data);

        player = new Player(
            client.id,
            data.username,
        );

        // #region Send packet
        var packet = new PacketQuickPlay();
        packet.username = data.username;
        packet.player = player;

        
        client.emit(PacketQuickPlay.getPacketID(), JSON.stringify(packet));
        // #endregion

        console.log(`${player.username} connected. ID: ${player.id}.`);

    });

    client.on('disconnect', (client) => {
        if(loggedIn)
            console.log(`Player '${player}' disconnected`);
        else
            console.log(`Client disconnected`);
    });
});
