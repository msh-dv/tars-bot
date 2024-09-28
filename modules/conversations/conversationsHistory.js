const { User, Thread } = require("./conversations");
const userModel = require("../mongo/models/Users");

const userData = new Map();
const threadsData = new Map();

async function loadUsersToMap() {
  const users = await userModel.find();
  const chatsCount = await userModel.countDocuments();
  console.log(`Cargando chats en memoria...`);
  let cont = 0;
  users.forEach((user) => {
    userData.set(
      user.id,
      new User(
        user.id,
        user.name,
        user.suscription,
        user.instructions,
        user.dynamicHistory,
        user.maxHistory
      )
    );
    cont++;
    process.stdout.write(`${cont} chats de ${chatsCount} cargados.\r`);
  });
  console.log();
}

async function getUser(id, name) {
  if (!userData.has(id)) {
    let user = await userModel.findOne({ id: id });
    if (!user) {
      user = new userModel({ id: id, name });
      await user.save();
    }
    userData.set(
      user.id,
      new User(
        user.id,
        user.name,
        user.suscription,
        user.instructions,
        user.dynamicHistory,
        user.maxHistory
      )
    );
  }
  return userData.get(id);
}

function removeUser(id) {
  userData.delete(id);
}

function getThread(id) {
  return threadsData.get(id);
}

function createThread(id, name) {
  threadsData.set(id, new Thread(id, name));
}

function isThreadInHistory(id) {
  if (threadsData.has(id)) {
    return true;
  }
}

module.exports = {
  getUser,
  removeUser,
  getThread,
  createThread,
  isThreadInHistory,
  loadUsersToMap,
};
