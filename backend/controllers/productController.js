const Product = require("../models/Product");
const fs = require('fs');

/**
 * intercepter les reqêtes POST / converti les données de l'objet en json
 * le dernier middleware renvoi la responce au client
 * renvoi un code http de 201 de création de donnée reussie
 */
exports.createProduct = (req, res, next) => {
  //extraire l'objet json de product
  const productObject = JSON.parse(req.body.sauce);
  //retirer le champ _id car elle sera automatiquement crée
  delete productObject._id;
  //création d'une nouvelle instance de l'objet product
  const product = new Product({
    //...copie du corps de la requête
    ...productObject,
    //genérer l'url de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //sauvegarde dans la base de donnée/envoi status de la requête
  //envoi en json et catch error en cas de soucis
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) =>
      res.status(400).json({ message: " ligne 44 Objet non enregistré !" })
    );
};

//envoi d'un seul product
exports.getProductUnity = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json(product))
    .catch((error) =>
      res.status(404).json({ message: " ligne 68 Objet non enregistré !" })
    );
};

//modification product
exports.modifProduct = (req, res, next) => {
  const productObjet = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

  } : {...req.body}
  Product.updateOne({ _id: req.params }, { ...productObjet, _id: req.params.id })
    .then(() => res.status(200).json({ message: "objet modifié" }))
    .catch((error) =>
      res.status(400).json({ message: " ligne 52 Objet non enregistré !" })
    );
};
//delete product et verification que l'utilisateur a bien le bon identifiant
exports.deleteProduct= (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then(product => {
      const filename = product.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Product.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  
  

//requêtes intercepte
exports.getAllProduct = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) =>
      res.status(400).json({ message: " ligne 80 Objet non enregistré !" })
    );
};
//likeOrnot
exports.likeOrNot = (req, res, next) => {
  if (req.body.like === 1) {
    Product.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) {
    Product.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(400).json({ error }))
  } else {
    Product.findOne({ _id: req.params.id })
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) {
                Product.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Product.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}