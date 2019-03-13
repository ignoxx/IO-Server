const GameLoop = require('node-gameloop');

class World {
    constructor() {
        this.maxPlayers = 64;
        this.players = {};

        console.log(`World created.. > MaxPlayers: ${this.maxPlayers}`);

        // 60 FPS loop
        this.gameLoopId = GameLoop.setGameLoop(this.gameLoop.bind(this), 1000 / 60);
    }

    addPlayer(Player) {
        // Limit players per world
        if (this.players.length + 1 > this.maxPlayer) {
            return false;
        }

        // Check if player is already logged in by name and ip addr, if yes return false
        /*for (let i in this.players) {
            if (this.players[i].addr === Player.addr) {
                console.log("detected same addr of already existing connection");
                return false;
            }
        }
        */

        this.players[Player.uid] = Player;
        Player.loggedIn = true;

        return true;
    }

    findPlayerByUid(uniqueId) {
        return (uniqueId in this.players);
    }

    getPlayer(uniqueId) {
        return this.players[uniqueId];
    }

    getPlayerDict() {
        return JSON.stringify(this.players);
    }

    removePlayer(Player) {
        Player.loggedIn = false;
        delete this.players[Player.uid];
    }

    gameLoop(delta) {

    }
}

module.exports = World;