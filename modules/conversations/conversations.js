import "dotenv/config";
import summarizeMessage from "../summarizer/summarizeMessage.js";

class Conversation {
  constructor(id, name, subscription, instrucciones, dynamicHistory, max) {
    this.id = id;
    this.name = name;
    this.subscription = subscription;
    this.instrucciones = instrucciones;
    this.maxHistory = max;
    this.fixedHistory = [
      { role: "system", content: this.instrucciones },
      { role: "system", content: `The user name is ${this.name}` },
    ];
    this.dynamicHistory = dynamicHistory;
    this.middleTermMemory = [];
    this.longTermMemory = [];
  }

  async summarize(message) {
    return await summarizeMessage(message);
  }

  async addMessage({ role, content }) {
    console.log("midle: ", this.middleTermMemory);
    console.log("short: ", this.dynamicHistory);
    this.dynamicHistory.push({ role, content });
    if (this.dynamicHistory.length > this.maxHistory) {
      const messageToSummarize = this.dynamicHistory.shift();
      if (
        messageToSummarize.role == "assistant" &&
        messageToSummarize.content.length > 450
      ) {
        const summarizedMessage = await this.summarize(
          messageToSummarize.content
        );
        this.middleTermMemory.push({
          role: messageToSummarize.role,
          content: summarizedMessage,
        });
      } else {
        this.middleTermMemory.push(messageToSummarize);
      }
    }
    if (this.middleTermMemory > this.maxHistory) {
      this.middleTermMemory.shift();
    }
  }

  getFullHistory() {
    return [
      ...this.fixedHistory,
      ...this.longTermMemory,
      ...this.middleTermMemory,
      ...this.dynamicHistory,
    ];
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

class User extends Conversation {
  constructor(id, name, subscription, instructions, dynamicHistory, max) {
    super(id, name, subscription, instructions, dynamicHistory, max);
  }
}

class Thread extends Conversation {
  constructor(id, name, instructions, dynamicHistory, max) {
    super(id, name, null, instructions, dynamicHistory, max);

    this.fixedHistory = [
      { role: "system", content: this.instrucciones },
      { role: "system", content: `The thread name is ${this.name}` },
    ];
  }
}

export { Conversation, User, Thread };
