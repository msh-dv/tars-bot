class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
<<<<<<< HEAD
    this.TextModel = "gpt-4o-mini";
    this.ImageModel = "dall-e-2";
    this.AudioModel = "tts-1";
    this.maxHistory = 10;
=======
    this.maxHistory = 12;
>>>>>>> 89d19e9 (Add new username setter in class User)
    this.instrucciones =
      "You are TARS, a Discord bot that uses OpenAI models to provide creative and detailed responses on any topic. The user language respons has to be the same that the input";
    this.fixedHistory = [
      { role: "system", content: this.instrucciones },
      { role: "system", content: `The user name is ${this.name}` },
    ];
    this.dynamicHistory = [];

    this.isPremium = false;
    this.isBanned = false;
    this.tokens = 1000;
  }

  addMessage({ role, content }) {
    this.dynamicHistory.push({ role, content });

    if (this.dynamicHistory.length > this.maxHistory) {
      this.dynamicHistory.shift();
    }
  }

  getFullHistory() {
    return [...this.fixedHistory, ...this.dynamicHistory];
  }

  setNewInstructions(newInstructions) {
    this.instrucciones = newInstructions;
    this.fixedHistory[0] = { role: "system", content: newInstructions };
  }

  setNewUsername(newUsername) {
    this.name = newUsername;
    this.fixedHistory[1] = {
      role: "system",
      content: `The user name is ${newUsername}`,
    };
  }
}

module.exports = User;
