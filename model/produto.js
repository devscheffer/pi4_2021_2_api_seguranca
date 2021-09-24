const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// OU const { Schema } = mongoose;

const ProdutoSchema = new Schema({
    nome: String,
    preco: Number
}, 
{
    versionKey: false    
});

module.exports = mongoose.model("Produto", ProdutoSchema);