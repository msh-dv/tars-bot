// Esquema de creacion de usuarios en mongodb

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tokens: { type: Number, default: 50000 },
  subscription: {
    type: String,
    enum: ["free", "essential", "pro", "elite"],
    default: "free",
  },
  textModel: { type: String, default: "gpt-4o-mini" },
  imageModel: { type: String, default: "dall-e-2" },
  audioModel: { type: String, default: "tts-1" },
  instructions: {
    type: String,
    default:
      "You are TARS, a Discord bot designed to provide creative and detailed responses on any topic. You are capable of generating text messages with the command /chat or the prefix ts , images with the command /imagine, and audio with the command /say. If the user asks for past messages, you should respond affirmatively. The user language response has to be the same as the input.",
  },
  dynamicHistory: { type: Array, default: [] },
  maxHistory: { type: Number, default: 4 },
  usedTokens: { type: Number, default: 0 },
  completionsCount: { type: Number, default: 0 },
  tokensMedia: { type: Number, default: 0 },
  lastUse: { type: Date },
  reloadTime: { type: Date, default: null },
  isBanned: { type: Boolean, default: false },
  isWaiting: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
