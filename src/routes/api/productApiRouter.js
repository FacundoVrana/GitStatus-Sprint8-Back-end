const express = require('express');
const router = express.Router();
const productsApiController = require("../../controllers/api/productsApiController");

// Rutas
// Listado de todos los productos en la db
router.get('/', productsApiController.list);

// Detalle de usuario
// router.get('/:id', productsApiController.detail);

module.exports = router;