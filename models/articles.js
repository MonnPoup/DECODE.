var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    name: String,
    price: String,
    brand: String,
    imageUrl: String,
    merchantUrl: String, 
    category: String,
    subCategory: String, 
    color: String,
    paletteName: String, 
    });
 
 var articleModel = mongoose.model('articles', articleSchema);

 module.exports = articleModel