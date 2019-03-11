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
        for(let i in this.players) {
            if(this.players[i].addr === Player.addr){
                return false;
            }
        }

        this.players[Player.id] = Player;
        Player.loggedIn = true;
        
        return true;
    }

    removePlayer(Player) {
        Player.loggedIn = false;
        delete this.players[Player.id];
    }

    gameLoop(delta) {

    }
}

module.exports = World;