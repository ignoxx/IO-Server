const GameLoop = require('node-gameloop');

class World {
    constructor() {
        this.maxPlayers = 64;
        this.players = {};

        console.log(`World created.. > MaxPlayers: ${this.maxPlayers}`);

        this.i = 0;
        this.gameLoopId = GameLoop.setGameLoop(this.gameLoop.bind(this), 1000 / 60);
    }

    addPlayer(Player) {
        // Limit players per world
        if (this.players.length + 1 > this.maxPlayer) {
            return false;
        }

        // Check if player is already logged in by name and ip addr, if yes return false
        // ..

        this.players.push(Player);
        return true;
    }

    gameLoop(delta) {
        
    }
}

module.exports = World;