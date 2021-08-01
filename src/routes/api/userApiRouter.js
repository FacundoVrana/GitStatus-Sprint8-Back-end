
const express = require('express');
const router = express.Router();
const userApiController = require('../../controller/api/userApiController');

//Rutas
//Listado de usuarios
router.get('/', userApiController.list);
//Cantidad de usuarios
router.get('/count', userApiController.count);
//Detalle de una usuario
router.get('/:id', userApiController.detail);



module.exports = router;