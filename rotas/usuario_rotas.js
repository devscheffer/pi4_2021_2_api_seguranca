const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuario_controller')

router.get('/', usuarioController.listar)
router.get('/search',usuarioController.buscarUsuario)
router.get('/:id', usuarioController.buscarPorId)
router.post('/', usuarioController.inserir)
router.post('/login', usuarioController.validaUsuario)
router.put('/:id', usuarioController.atualizar)
router.delete('/:id', usuarioController.deletar)

module.exports = router;