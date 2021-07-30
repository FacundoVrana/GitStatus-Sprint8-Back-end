const express = require('express');
const router = express.Router();
const userApiController = require("../../controllers/api/userApiController");

// Rutas
// Listado de todos los usuarios en la db
router.get('/', userApiController.list);

// Detalle de usuario
router.get('/:id', userApiController.detail);

module.exports = router;