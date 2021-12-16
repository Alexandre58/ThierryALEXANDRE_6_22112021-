const bcrypt = require("bcrypt");
const User = require("../models/User");
const jsonWebToken = require("jsonwebtoken");
//npm install --save jsonwebtoken
//installation bcrypt //npm install --save bcript

/**********************************enregistrement d'utilisateur et hashage du mot de passe***********************/
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "Nouveau utilisateur crée" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
/*******************************************************Connection des utilisateurs ********************************/
exports.login = (req, res, next) => {
  //recup utilisateur
  //if user !user =>error
  //compare mot de pass entré avec celui de la base de donnée/ if !valid =>error
  //if valid renvoi un userId et un token
  //token: jsonWebToken.sign = encodage token contient id en tant que
  //payload(données encodées dans le token).chaine secrete a changer pour la production puis renvoi au frontend avec notre responce

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "pas d'utilisateur trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Le mot de passe n'est pas valide" });
          }
          res.status(200).json({
            userId: user._id,
            token: jsonWebToken.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
