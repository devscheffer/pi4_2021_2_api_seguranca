const Produto = require("../model/produto")

exports.listar = (req, res) => {
  Produto.find({}, (err, produtos) => {
    if(err) {
      res.status(500).send(err);
    }
    res.json(produtos);
  })
}

exports.buscarPorId = (req, res) => {
  const id = req.params.id;
    Produto.findById(id, (err, produto) => {
      if(err) {
        res.status(500).send(err);
      }
      if(produto) {        
        res.json(produto);
      }
      else {
        res.status(404).json({erro:"Produto nao encontrado"});
      }
    })
}

exports.inserir = (req, res) => {
    let novoProduto = new Produto(req.body);
    novoProduto.save((err, produto) => {
      if(err) {
        res.send(err);
      }
      res.status(201).json(novoProduto);
    })
  }

  exports.atualizar = (req, res) => {
    const id = req.params.id;
    const produtoAtualizar = req.body;

    Produto.findByIdAndUpdate(id, produtoAtualizar, {new:true},
      (err, produtoAtualizado) => {
        if(err) {
          res.status(500).send(err);
        }
        if(produtoAtualizado) {        
          res.json(produtoAtualizado);
        }
        else {
          res.status(404).json({erro:"Produto nao encontrado"});
        }
      })    
  }

  exports.deletar  = (req, res) => {
    const id = req.params.id;
    Produto.findByIdAndDelete(id, (err, produtoDeletado) =>{
      if(err) {
        res.status(500).send(err);
      }
      if(produtoDeletado) {        
        res.json(produtoDeletado);
      }
      else {
        res.status(404).json({erro:"Produto nao encontrado"});
      }
    });
  }

  exports.procurar = (req, res) => {
    if(req.query && req.query.nome){
      const paramNome = req.query.nome;
      Produto.find({nome: paramNome}, (err, produtos) => {
        if(err) {
          res.status(500).send(err);
        }
        if(produtos && produtos.length > 0) {        
          res.json(produtos);
        }
        else {
          res.status(404).json({erro:"Produto nao encontrado"});
        }
      })   
    }
    else{
      res.status(400).send({erro:"Faltou o parametro nome"});
    }
  }