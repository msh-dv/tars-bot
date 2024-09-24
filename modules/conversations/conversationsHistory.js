const { User, Thread } = require("./conversations");

const userData = new Map();
const threadsData = new Map();

function getUser(id, name) {
  if (!userData.has(id)) {
    userData.set(id, new User(id, name));
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
};
