const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productController');
//gestion identification
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/********************ROUTE***************************** */
/**
 * intercepter les reqêtes POST / converti les données de l'objet en json
 * le dernier middleware renvoi la responce au client
 * renvoi un code http de 201 de création de donnée reussie
 */
router.post('/', auth,multer, productControllers.createProduct);
    /**
   * recup d'un seule article product
   */
router.get('/:id', auth, productControllers.getProductUnity);
  /**
   * modification d'un article product
   */
router.put('/:id', auth,multer ,productControllers.modifProduct);
  /**
   * 
  * suppression d'un article product
  */
router.delete('/:id',auth, productControllers.deleteProduct);
  /**
   * 
   * intercepter tout les products
   * (/api/sauces) = http://3000/api/sauces
   */
router.get('/',auth, productControllers.getAllProduct);
/**
 * 
 * 
 */
 router.post('/:id/like', auth, productControllers.likeOrNot);
  /***********************************FIN ROUTE************ */

module.exports = router;