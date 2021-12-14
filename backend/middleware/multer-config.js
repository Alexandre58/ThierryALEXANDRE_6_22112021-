const multer = require("multer");
//multer permet l'envoi de fichier provenant des utilisateurs par exemple les images
//ce package Multer va gérer les fichiers entrant dans les requêtes HTTP
//objet d'extension d'images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
//diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //utilisation du nom d'origine
  //de remplacer les espaces par des underscores et d'ajouter un timestamp {date}comme nom d'origine
  filename: (req, file, callback) => {
    /* Remplacer les espaces par des _ */
  const name = file.originalname.split(' ').join('_');
  const extension = MIME_TYPES[file.mimetype];
  /* Renommer le fichier avec son nom d'origine + date + extension */
  callback(null, name + Date.now() + '.' + extension);
}
});
//single()  crée un middleware qui capture les fichiers d'un certain type (passé en argument),
// et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
module.exports = multer({ storage }).single("image");
