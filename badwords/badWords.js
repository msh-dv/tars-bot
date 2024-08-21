const fs = require("fs");

const datos = JSON.parse(fs.readFileSync("badwords/bw.json", "utf8"));

const palabrasProhibidas = new Set(
  datos.RECORDS.map((record) => record.word.toLowerCase())
);

function isBadWord(mensaje) {
  const palabrasDelMensaje = mensaje.toLowerCase().split(/\s+/);

  for (const palabra of palabrasDelMensaje) {
    if (palabrasProhibidas.has(palabra.toLowerCase())) {
      console.log(palabra);
      return true;
    }
  }

  return false;
}

module.exports = isBadWord;
