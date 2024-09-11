const Thread = require("./threads");

//Modulo para guardar instancias de hilos desde otros archivos

const threadsData = new Map();

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

module.exports = { getThread, createThread, isThreadInHistory };
