class Player {
    constructor(data){
      this.id = data.id;
      this.username = data.username;
      this.addr = data.addr;

      this.loggedIn = false;
    }
  }
  
  
  module.exports = Player;