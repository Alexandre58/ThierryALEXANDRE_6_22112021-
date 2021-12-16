const jsonWebToken = require("jsonwebtoken");
//La méthode  verify()  du package jsonwebtoken permet de vérifier la validité d'un //token (sur une requête entrante, par exemple).
//Gestion d'erreurs d'identifications
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];//recup token du headers =>table =>deuxieme el
    const decodedToken = jsonWebToken.verify(token, "RANDOM_TOKEN_SECRET");//verif token/clé
    const userId = decodedToken.userId;//recup userId dans le token
    req.auth = { userId: userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "UserId non valide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Requête invalide !')
    });
  }
};
