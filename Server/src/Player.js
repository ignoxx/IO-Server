class Player {
  constructor(data) {
    this.id = data.id;
    this.uid = data.uid;
    this.username = data.username;

    this.loggedIn = false;
    this.connected = false;
  }
}


module.exports = Player;