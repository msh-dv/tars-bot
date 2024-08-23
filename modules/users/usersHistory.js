const User = require("./users");

//Modulo para guardar instancias de usuarios desde otros archivos

const userData = new Map();

function getUser(id, name) {
  if (!userData.has(id)) {
    userData.set(id, new User(id, name));
  }
  console.log(userData);
  return userData.get(id);
}

function removeUser(id) {
  userData.delete(id);
}

module.exports = { getUser, removeUser };
