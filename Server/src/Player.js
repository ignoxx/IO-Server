class Player {
    constructor(id, address, username){
      this.id = id;
      this.username = username;
      this.address = address;

      this.loggedIn = false;
    }
  }
  
  
  module.exports = Player;