class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.maxHistory = 15;
    this.TextModel = "gpt-4o-mini";
    this.ImageModel = "dall-e-2";
    this.AudioModel = "tts-1";
    this.instrucciones =
      "You are TARS, a Discord bot designed to provide creative and detailed responses on any topic. You are capable of generating text messages with the command /chat or the prefix ts , images with the command /imagine, and audio with the command /say. If the user asks for past messages, you should respond affirmatively. The user language response has to be the same as the input.";
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

  wipeMemory() {
    this.instrucciones =
      "You are TARS, a Discord bot designed to provide creative and detailed responses on any topic. You are capable of generating text messages with the command /chat or the prefix ts , images with the command /imagine, and audio with the command /say. If the user asks for past messages, you should respond affirmatively. The user language response has to be the same as the input.";
    this.fixedHistory = [
      { role: "system", content: this.instrucciones },
      { role: "system", content: `The user name is ${this.name}` },
    ];
    this.dynamicHistory = [];
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
