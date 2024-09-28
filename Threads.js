// Esquema de creacion de hilos en mongodb

const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  textModel: { type: String, default: "gpt-4o-mini" },
  instructions: {
    type: String,
    default:
      "You are TARS, a Discord bot designed to provide creative and detailed responses on any topic. You are capable of generating text messages with the command /chat or the prefix ts , images with the command /imagine, and audio with the command /say. If the user asks for past messages, you should respond affirmatively. The user language response has to be the same as the input.",
  },
  dynamicHistory: { type: Array, default: [] },
  maxHistory: { type: Number, default: 10 },
});

const Thread = mongoose.model("Threads", threadSchema);

module.exports = Thread;
