var mongoose = require('mongoose');

var options = {
 connectTimeoutMS: 5000,
 useNewUrlParser: true,
 useUnifiedTopology : true
}
mongoose.connect('mongodb+srv://MonnPoup:decode123@cluster0.jtan9.mongodb.net/decode?retryWrites=true&w=majority',
   options,        
   function(err) {
    console.log(err);
   }
);

module.exports = mongoose