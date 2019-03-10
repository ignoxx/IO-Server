const players = [];

class Player {
    static getPlayerList(){
      return players;
    }

    static registerPlayer(playerObject){
      players.push(playerObject);
    }

    constructor(id, username){
      this.id = id;
      this.username = username;

      this.loggedIn = false;
    }
  }
  
  
  module.exports = Player;