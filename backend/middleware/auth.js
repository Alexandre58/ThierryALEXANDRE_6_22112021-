const jsonWebToken = require("jsonwebtoken");
//La méthode  verify()  du package jsonwebtoken permet de vérifier la validité d'un //token (sur une requête entrante, par exemple).
//Gestion d'erreurs d'identifications
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonWebToken.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Utilisateur non valide";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "requête non identifiée" });
  }
};
