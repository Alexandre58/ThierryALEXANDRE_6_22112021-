const multer = require("multer");

//objet d'extension d'images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};
//diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
const storage = multer.diskStorage({
  //destination des fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //utilisation du nom d'origine
  //de remplacer les espaces par des underscores et d'ajouter un timestamp {date}comme nom d'origine
  filename: (req, file, callback) => {
    const name = file.originalname.split('.')[0]
    name.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + '_' + Date.now() + '.' + extension)
  },
});
//single()  crée un middleware qui capture les fichiers d'un certain type (passé en argument),
// et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
module.exports = multer({ storage }).single("image");
