const GameLoop = require('node-gameloop');

class World {
    constructor() {
        this.maxPlayers = 64;
        this.players = {};
    }

    addPlayer(Player) {
        // #region Check if server is full
        if (Player.getPlayerList().length + 1 > maxPlayer) {
            client.disconnect();
            console.log('Incoming connection closed. Server full');

            // TODO: Tell Client that server is full
        }
        // #endregion
    }

    gameLoop() {

    }
}