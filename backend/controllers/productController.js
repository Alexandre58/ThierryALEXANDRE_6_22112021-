"use strict";
const Product = require("../models/Product");
//"file system access to the operation linked to the different files
const fs = require("fs");

/***************************************************CRUD*********************************** */
exports.createProduct = (req, res, next) => {
  const productObject = JSON.parse(req.body.sauce);
  delete productObject._id;//remove the _id field, it will be automatically created by mongodb
  //creation of a new instance of the product object
  const product = new Product({
    //...copy of the body of the request
    ...productObject,
    //generate image url
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  //save in database / send request status
  product
    .save()
    .then(() => res.status(201).json({ message: "Registered object !" }))
    .catch((error) =>
      res.status(400).json({ message: "Unregistered object !" })
    );
};


 /***********************find () returns all products****************************/
 exports.getAllProduct = (req, res, next) => {
  Product.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({ message: "Unregistered object!" })
    );
};
/*return of a single product (by retrieving verif if the: _id === req.params.id)*/
exports.getProductUnity = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({ message: "Unregistered object !" })
    );
};

/****************************product modification********************************/
exports.modifProduct = (req, res, next) => {
  const productObjet = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
    //method updateOne() 1er argument = object  modify/verifSiId=idOk
  Product.updateOne(
    { _id: req.params.id },
    { ...productObjet, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Modified sauce !" }))
    .catch((error) => res.status(400).json({ error }));
};


/***********delete product by verifying that the user has the correct username******/
exports.deleteProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      const filename = product.imageUrl.split("/images/")[1];//extract name of file to delete
      fs.unlink(`images/${filename}`, () => {
        Product.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Deleted object !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(500).json({ error }));
};

/**********************************************likedProduct and dislikedProduct***** */
exports.likeProducts = (req, res) => {
  //If the customer likes this sauce $inc=opérateur incrémente
  if (req.body.like === 1) {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like added !" }))
      .catch((error) => res.status(400).json({ error }));
    /* If the customer dislike this sauce */
  } else if (req.body.like === -1) {
    try {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike added!" }))
      .catch((error) => res.status(400).json({ error }));
    } catch (e) {
      console.log(e);
    }
    /* If the customer cancels their choice */
  } else {
    Product.findOne({ _id: req.params.id }).then((resultat) => {
      if (resultat.usersLiked.includes(req.body.userId)) {
        Product.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "like removed !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (resultat.usersDisliked.includes(req.body.userId)) {
        Product.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "dislike removed !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};

