var mongoose = require('mongoose');

var paletteSchema = mongoose.Schema({
    name: String,
    description: String,
    inspirations: Array,
    colors: Array,
    });
 
 var paletteModel = mongoose.model('palettes', paletteSchema);

 module.exports = paletteModel