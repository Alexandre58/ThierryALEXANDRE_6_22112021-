const Product = require('../models/Product');


/**
 * intercepter les reqêtes POST / converti les données de l'objet en json
 * le dernier middleware renvoi la responce au client
 * renvoi un code http de 201 de création de donnée reussie
 */
exports.createProduct = (req, res, next) => {
    //retirer le champ _id car elle sera automatiquement crée
      delete req.body._id;
      //création d'une nouvelle instance de l'objet product
      const product = new Product({
        //...copie du corps de la requête
        ...req.body
      });
      //sauvegarde dans la base de donnée/envoi status de la requête
      //envoi en json et catch error en cas de soucis
      product.save()
             .then(()=> res.status(201).json({message: 'Objet enregistré !'}))
             .catch(error => res.status(400).json({message: ' ligne 44 Objet non enregistré !'}));
  };

  //envoi d'un seul product
  exports.getProductUnity = (req, res , next)=> {
    Product.findOne({_id: req.params.id})
    .then(product => res.status(200).json(product))
    .catch(error => res.status(404).json({message: ' ligne 68 Objet non enregistré !'}));
  };
  //modification product
  exports.modifProduct = (req, res , next)=> {
    Product.updateOne({_id: req.params},{...req.body, _id: req.params.id})
          .then(()=> res.status(200).json({message: 'objet modifié'}))
          .catch(error => res.status(400).json({message: ' ligne 52 Objet non enregistré !'}));
  };
  //delete product
  exports.deleteProduct = (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({message: ' ligne 60 Objet non enregistré !'}));
  };
  //requêtes intercepte
  exports.getAllProduct = (req, res, next) => {
    Product.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({message: ' ligne 80 Objet non enregistré !'}));
   };