var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: String,
    email: String,
    password: String,
    token: String,
    palette: { type: mongoose.Schema.Types.ObjectId, ref: 'palettes' }, 
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],
 });
 
 var userModel = mongoose.model('users', userSchema);

 module.exports = userModel