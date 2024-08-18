class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.maxHistory = 10;
    this.instrucciones =
      "You are TAIRS, a Discord bot that uses OpenAI models to provide creative and detailed responses on any topic. The user language respons has to be the same that the input";
    this.fixedHistory = [
      { role: "system", content: this.instrucciones },
      { role: "system", content: `The user name is ${this.name}` },
    ];
    this.dynamicHistory = [];
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
}

module.exports = User;
