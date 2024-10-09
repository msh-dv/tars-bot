import { User, Thread } from './conversations.js';
import userModel from '../mongo/models/Users.js';
import threadModel from '../mongo/models/Threads.js';

const userData = new Map();
const threadsData = new Map();

// TODO: Refactorizar set users

//Users
async function loadUsersToMap() {
  const users = await userModel.find();
  const threads = await threadModel.find();
  const chatsCount =
    (await userModel.countDocuments()) + (await threadModel.countDocuments());
  console.log(`Cargando chats en memoria...`);
  let cont = 0;
  users.forEach((user) => {
    userData.set(
      user.id,
      new User(
        user.id,
        user.name,
        user.subscription,
        user.instructions,
        user.dynamicHistory,
        user.maxHistory
      )
    );
    cont++;
  });
  threads.forEach((thread) => {
    threadsData.set(
      thread.id,
      new Thread(
        thread.id,
        thread.name,
        thread.instructions,
        thread.dynamicHistory,
        thread.maxHistory
      )
    );
    cont++;
  });
  process.stdout.write(`${cont} chats de ${chatsCount} cargados.\r`);
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
        user.subscription,
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

//Threads

async function getThread(id) {
  return threadsData.get(id);
}

async function createThread(id, name) {
  const thread = new threadModel({ id: id, name });
  await thread.save();

  threadsData.set(
    thread.id,
    new Thread(
      thread.id,
      thread.name,
      thread.instructions,
      thread.dynamicHistory,
      thread.maxHistory
    )
  );
}

function isThreadInHistory(id) {
  if (threadsData.has(id)) {
    return true;
  }
}

function removeThread(id) {
  threadsData.delete(id);
}

export {
  getUser,
  removeUser,
  getThread,
  createThread,
  isThreadInHistory,
  loadUsersToMap,
  removeThread,
};
