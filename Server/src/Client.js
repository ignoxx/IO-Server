class Client {
  constructor(data) {
    this.socket = data.socket;
    this.uniqueId = Math.random().toString(36).substring(3, 16) + +new Date;

    this.player;
    this.playerTimeOut = 30;
  }

  formatUsername(username) {
    if (username.length <= 0 || username === '') {
      username = 'player_' + Math.floor(Math.random() * Math.floor(100));
    }

    // Remove illegal characters
    username = username.replace(/([^a-z0-9]+)/gi, '-');

    return username;
  }

  getFullUniqueId(uniqueId = '') {
    if(uniqueId === '')
      return `${this.uniqueId}${this.socket.handshake.address}`;
    else
      return `${uniqueId}${this.socket.handshake.address}`;
  }

  isValidUniqueId(uniqueId) {
    return (uniqueId !== "undefined");
  }

  playerExists() {
    return (this.player !== undefined);
  }

  isPlayerLoggedIn() {
    if(this.playerExists()) {
      return this.player.loggedIn;
    }
  }

  isPlayerConnected() {
    if(this.playerExists()) {
      return this.player.connected;
    }
  }


}


module.exports = Client;