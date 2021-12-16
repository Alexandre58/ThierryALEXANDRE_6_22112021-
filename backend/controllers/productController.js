const Product = require("../models/Product");
//"file system accés au opération lié au differents fichiers
const fs = require("fs");
/***************************************OPERATION CRUD*************** ******************************************/
/**
 *
 * intercepter les reqêtes / converti les données de l'objet en json
 * le dernier middleware renvoi la responce au client
 * renvoi un code http de création de donnée reussie
 */
/***************************************************CREAT************ */
exports.createProduct = (req, res, next) => {
  //extraire l'objet json de product
  const productObject = JSON.parse(req.body.sauce);
  
  delete productObject._id;//retirer le champ _id car elle sera automatiquement crée par mongodb
  //création d'une nouvelle instance de l'objet product
  const product = new Product({
    //...copie du corps de la requête
    ...productObject,
    //genérer l'url de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  //sauvegarde dans la base de donnée/envoi status de la requête
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) =>
      res.status(400).json({ message: " ligne 44 Objet non enregistré !" })
    );
};
/***********************************************READ************************* */
/**
 * find()renvoie tout les products
 */
 exports.getAllProduct = (req, res, next) => {
  Product.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({ message: "Objet non enregistré !" })
    );
};
//renvoi d'un seul product (en récupérant verif si le :_id===req.params.id)
exports.getProductUnity = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({ message: "Objet non enregistré !" })
    );
};
/******************************************UPDATE***************************** */
//modification product
exports.modifProduct = (req, res, next) => {
  const productObjet = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
    //methode updateOne() 1er argument=objet a modifier/verifSiId=idOk
  Product.updateOne(
    { _id: req.params.id },
    { ...productObjet, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/********************************************************DELETE********************* */
//delete product en verifiant que l'utilisateur a bien le bon identifiant
exports.deleteProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      const filename = product.imageUrl.split("/images/")[1];//extraire nom fichier a supprimer
      fs.unlink(`images/${filename}`, () => {
        Product.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(500).json({ error }));
};

/**********************************************likedProduct and dislikedProduct***** */
exports.likeProducts = (req, res) => {
  /* Si le client Like cette sauce */
  if (req.body.like === 1) {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
    /* Si le client dislike cette sauce */
  } else if (req.body.like === -1) {
    try {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { UsersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
    } catch (e) {
      console.log(e);
    }
    /* Si le client annule son choix */
  } else {
    Product.findOne({ _id: req.params.id }).then((resultat) => {
      if (resultat.usersLiked.includes(req.body.userId)) {
        Product.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (resultat.UsersDisliked.includes(req.body.userId)) {
        Product.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { UsersDisliked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};

