const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productController');

/********************ROUTE***************************** */
/**
 * intercepter les reqêtes POST / converti les données de l'objet en json
 * le dernier middleware renvoi la responce au client
 * renvoi un code http de 201 de création de donnée reussie
 */
router.post('/',productControllers.createProduct);
    /**
   * recup d'un seule article product
   */
router.get('/:id',productControllers.getProductUnity);
  /**
   * modification d'un article product
   */
router.put('/:id', productControllers.modifProduct);
  /**
   * 
  * suppression d'un article product
  */
router.delete('/:id', productControllers.deleteProduct);
  /**
   * 
   * intercepter tout les products
   * (/api/sauces) = http://3000/api/sauces
   */
router.get('/', productControllers.getAllProduct);
  /***********************************FIN ROUTE************ */

module.exports = router;