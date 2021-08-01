const express = require('express');
const router = express.Router();
const productApiController = require('../../controller/api/productApiController');

//Rutas
//Listado de productos
router.get('/', productApiController.list);
//Cantidad de productos
router.get('/count', productApiController.count);
//ultimo producto
router.get('/latest', productApiController.latest);
//Detalle de un producto
router.get('/:id', productApiController.detail);



module.exports = router;