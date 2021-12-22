"use strict";
const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productController");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

/**
 * creat
 */
router.post("/", auth, multer, productControllers.createProduct);
/**
 * modify
 */
router.put("/:id", auth, multer, productControllers.modifProduct);
/**
 *
 * delete
 */
router.delete("/:id", auth, productControllers.deleteProduct);
/**
 * recup of a single product item
 */
router.get("/:id", auth, productControllers.getProductUnity);
/**
 *
 * intercept all products
 * (/api/sauces) = http://3000/api/sauces
 */
router.get("/", auth, productControllers.getAllProduct);

/**
 *
 *like/disliked
 */
router.post("/:id/like", auth, productControllers.likeProducts);


module.exports = router;
