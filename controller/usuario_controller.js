const Usuario = require("../model/usuario")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.listar = (req, res) => {
  Usuario.find({}, (err, usuarios) => {
    if(err) {
      res.status(500).send(err);
    }    
    res.json(
      usuarios.map((usuario) => { 
        return({id:usuario.id, nome: usuario.nome, email:usuario.email});
      })
    );
  })
}

exports.buscarPorId = (req, res) => {
  const id = req.params.id;
    Usuario.findById(id, (err, usuario) => {
      if(err) {
        res.status(500).send(err);
      }
      if(usuario) {        
        res.json(usuario);
      }
      else {
        res.status(404).json({erro:"Usuario nao encontrado"});
      }
    })
}

exports.inserir = (req, res) => {
    let novoUsuario = new Usuario(req.body);
    novoUsuario.senha = bcrypt.hashSync(req.body.senha, 10);
    novoUsuario.save((err, usuario) => {
      if(err) {
        res.send(err);
      }
      res.status(201).json(novoUsuario);
    })
  }

  exports.atualizar = (req, res) => {
    const id = req.params.id;
    const usuarioAtualizar = req.body;
    if(req.body.senha) {
      usuarioAtualizar.senha = bcrypt.hashSync(req.body.senha, 10);
    }

    Usuario.findByIdAndUpdate(id, usuarioAtualizar, {new:true},
      (err, usuarioAtualizado) => {
        if(err) {
          res.status(500).send(err);
        }
        if(usuarioAtualizado) {        
          res.json(usuarioAtualizado);
        }
        else {
          res.status(404).json({erro:"Usuario nao encontrado"});
        }
      })    
  }

  exports.deletar  = (req, res) => {
    const id = req.params.id;
    Produto.findByIdAndDelete(id, (err, usuarioDeletado) =>{
      if(err) {
        res.status(500).send(err);
      }
      if(usuarioDeletado) {        
        res.json(usuarioDeletado);
      }
      else {
        res.status(404).json({erro:"Usuario nao encontrado"});
      }
    });
  }

  exports.buscarUsuario = (req, res) => {
    if(req.query && req.query.nome){
      const paramNome = req.query.nome;
      Usuario.findOne({nome: paramNome}, (err, usuario) => {
        if(err) {
          res.status(500).send(err);
        }
        if(usuario) {        
          res.json(usuario);
        }
        else {
          res.status(404).json({erro:"Usuario nao encontrado"});
        }
      })   
    }
    else{
      res.status(400).send({erro:"Faltou o parametro nome"});
    }
  }

  exports.validaUsuario = (req, res) => {
      if(req.body && req.body.nome && req.body.senha) {
          const nomeUsuario = req.body.nome;
          const senhaUsuario = req.body.senha;

          Usuario.findOne({nome: nomeUsuario}, (err, usuario) => {
              if(err){
                  res.status(500).send(err);
              }

              if(usuario && bcrypt.compareSync(senhaUsuario, usuario.senha)) {
                const token = jwt.sign({
                  id: usuario.id
                }, 'Sen@crs', { expiresIn: "1h" });
                res.status(201).json({token: token});
              }
              else {
                  res.status(401).json({erro: "Usuario ou senha invalidos"});
              }
          });
      }
      else {
        res.status(401).json({erro: "Usuario ou senha invalidos"});
      }
  }

  exports.validaToken = (req, res, next) => {
    const token = req.get('x-auth-token'); //vem do header
    if(!token) {
      res.status(401).json({erro:"Token Invalido"});        
    }
    else {
      jwt.verify(token, 'Sen@crs', (err, payload) =>{
        if(err) {
          res.status(401).json({erro:"Token Invalido"});
        }        
        else {
          console.log("Payload: "+JSON.stringify(payload));
          next();
        }
      })
    }

  }

