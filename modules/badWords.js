const fs = require("fs");

const datos = JSON.parse(fs.readFileSync("badwords/bw.json", "utf8"));

const palabrasProhibidas = new Set(
  datos.RECORDS.map((record) => record.word.toLowerCase())
);

function isBadWord(mensaje) {
  const palabrasDelMensaje = mensaje.toLowerCase().split(/\s+/);

  return palabrasDelMensaje.some((palabra) =>
    palabrasProhibidas.has(palabra.toLowerCase())
  );
}

module.exports = isBadWord;
