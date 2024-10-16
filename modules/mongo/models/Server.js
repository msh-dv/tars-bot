// Esquema de creacion de servidores en mongodb

import mongoose from "mongoose";

const serverSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tokens: { type: Number, default: 500000 },
  subscription: {
    type: String,
    enum: ["free", "essential", "pro", "elite"],
    default: "free",
  },
  reloadTime: { type: Date, default: null },
  isBanned: { type: Boolean, default: false },
  isWaiting: { type: Boolean, default: false },
});

const Server = mongoose.model("Server", serverSchema);

export default Server;
