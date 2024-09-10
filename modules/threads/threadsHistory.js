const Thread = require("./threads");

//Modulo para guardar instancias de hilos desde otros archivos

const threadsData = new Map();

function getThread(id, name) {
  if (!threadsData.has(id)) {
    threadsData.set(id, new Thread(id, name));
  }
  console.log(threadsData);
  return threadsData.get(id);
}

module.exports = getThread;
