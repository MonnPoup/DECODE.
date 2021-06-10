var express = require("express");
var router = express.Router();

var uid2 = require("uid2");
var bcrypt = require("bcrypt");

var userModel = require("../models/users");
var paletteModel = require("../models/palettes");
var articleModel = require("../models/articles");

router.get("/", async (req, res, next) => {
  res.json();
});

router.post('/signUp', async (req, res, next) => {
  console.log('req.body.paletteFromStore._id', req.body)
  var error = []
  var saveUser = null
  var result = false
  var token = null

  
  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });

  if (data != null) {
    error.push("Utilisateur déjà présent");
  }

  if (
    req.body.usernameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == ""
  ) {
    error.push("Champs vides");
  }

  if (
    req.body.paletteFromStore === 'undefined' 
    ) {
      error.push('Répondez au questionnaire avant de vous inscrire')
    }
  
  
  if(error.length == 0){
console.log('body palette', req.body.paletteFromStore)
      var hash = bcrypt.hashSync(req.body.passwordFromFront, 10); 
      var newUser = new userModel({
      firstName: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      palette: req.body.paletteFromStore, 
      wishlist: [] 
    })
  
    saveUser = await newUser.save();
   /*  await saveUser.updateOne({palette : idPalette}) */
    console.log('id recu', saveUser)
    console.log('tout palette', saveUser.palette)
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }

  res.json({ result, error, saveUser, token });
});

router.post("/signIn", async (req, res) => {
  var result = false;
  var user = null;
  var error = [];
  var token = null;

  if (req.body.emailFromFront == "" || req.body.passwordFromFront == "") {
    error.push("Champs vides");
  }

  if (error.length == 0) {
    const userIsFound = await userModel.findOne({
      email: req.body.emailFromFront,
    });

    if (userIsFound) {
      if (bcrypt.compareSync(req.body.passwordFromFront, userIsFound.password)) {
        var user = await userModel
          .findById(userIsFound._id)
          .populate("palette")
          .populate('wishlist')
          .exec()

        result = true;
        token = user.token;
        res.json({ result, user, token})
      } else {
        result = false;
        error.push("Mot de passe incorrect");
        res.json({ result, error })
      }
    } else {
      error.push("Email incorrect");
      res.json({ result, error})
    }
  }

  ;
});

router.post("/validerQuiz", async (req, res, next) => {
  ///////////////// QUESTIONNAIRE ////////////
  var result = false;
  var userPalette = null;
  var isConnected = false
  if (req.body.token !== null ) { isConnected = true} 
 
  var responses = [req.body.rep1, req.body.rep2, req.body.rep3, req.body.rep4, req.body.rep5, req.body.rep6, req.body.rep7]  

  var palette1 = 0;
  var palette2 = 0;
  var palette3 = 0;
  var palette4 = 0;

  for (var i = 0; i < responses.length; i++) {
    if (responses[i] === "ethnique") {
      palette1++;
    } else if (responses[i] === "bohème") {
      palette2++;
    } else if (responses[i] === "artDeco") {
      palette3++;
    } else if (responses[i] === "modernMinimal") {
      palette4++;
    }
  }

  if (responses[2] === "ethnique") {
    palette1 += 2;
  } else if (responses[2] === "bohème") {
    palette2 += 2;
  } else if (responses[2] === "artDeco") {
    palette3 += 2;
  } else if (responses[2] === "modernMinimal") {
    palette4 += 2;
  }

  var compteursArray = [
    { palette: "ethnique", compteur: palette1 },
    { palette: "bohème", compteur: palette2 },
    { palette: "artDeco", compteur: palette3 },
    { palette: "modernMinimal", compteur: palette4 },
  ];

  var sortedResults = compteursArray.sort(function compare(a, b) {
    if (a.compteur < b.compteur)
       return -1;
    if (a.compteur > b.compteur )
       return 1;
    return 0;}
    )

 console.log('Votre palette est ', sortedResults[sortedResults.length-1].palette)   

 var resultquizz = sortedResults[sortedResults.length-1].palette

 /////////////////////// TROUVER LA PALETTE EN BDD ////////////////

  var userPalette = await paletteModel.findOne(    // find palette dans la bdd 
  {name: resultquizz})

 if (isConnected === false){
    console.log('userpalette ', userPalette)
    if (userPalette) 
    {result = true; res.json({result, userPalette})}
     else {res.json({result})}  
   } 
   else  {  

      var userUpdated = await userModel.updateOne( 
        {token: req.body.token},
        {palette: userPalette._id}
      ) 
        console.log('userUpdated', userUpdated)
      if (userUpdated) { result = true; res.json({result, userPalette}) }
      else {res.json({result})} 
   }

  });
 

router.post("/myPalette", async (req, res, next) => {
  if (req.body.token != null) {
    var userForId = await userModel.findOne(   // trouver l'utilisateur avec son token 
      {token: req.body.token})

      var user = await userModel.       // populate pour aller récupére la palette 
      findById(userForId._id)
      .populate('palette')
      console.log('user et sa palette', user.palette)
  
    res.json({userPalette: user.palette})}

    else {
      res.json({userPalette: false})
    }
});

router.post("/myShoppingList", async (req, res) => {
  var result = false;
  var paletteFromFront = req.body.paletteName;

  var shoppingList = await articleModel.find({
    paletteName: paletteFromFront,
  });

  if (shoppingList) {
    result = true;
    res.json({ result, shoppingList });
  } else {
    res.json({ result });
  }
});

router.post("/addToWishlist", async (req, res) => {
  var result = false;
  article = req.body.articleID;
  console.log('id article:', article)
  const findUser = await userModel.findOne({token: req.body.token})

  var updateUser = await userModel.updateOne(
    { token: req.body.token },
    {$push: 
    {wishlist: article}
    } );

  var user = await userModel
    .findById(findUser._id)
    .populate("wishlist")
    .exec();

  var wishlist = user.wishlist;

  if (updateUser.n !=0){
    result=true
    res.json({ result, wishlist })
  } else { 
    res.json({result})
  }
});

router.post("/wishlist", async (req, res) => {
  var result = false; 
  var findUser = await userModel.findOne({token: req.body.token})
  console.log('find user', findUser)
  var user = await userModel
    .findById(findUser._id)
    .populate("wishlist")
    .exec();

  var wishlist = user.wishlist;
  
  if (wishlist.lenght != 0) {
    result = true;
    res.json({ result, wishlist });
  } else {
    result = false;
    res.json({ result });
  }
});

router.put("/deleteFromWishlist", async (req, res) => {
  var result = false;
  console.log(req.body.token)

  const myUser = await userModel.findOne(
    {token : req.body.token}
  )

  var update = await userModel.updateOne(
    {token : req.body.token}, 
    {$pull: 
      {wishlist: req.body.articleID}
    }
  )

 /* var UserWishlist = myUser.wishlist
  UserWishlist.splice(req.body.index, 1 )

  const update = await userModel.updateOne(
    {token: req.body.token},
     {wishlist : UserWishlist}
  ) */

  var user = await userModel
    .findById(myUser._id)
    .populate("wishlist")
    .exec();

  var wishlist = user.wishlist

  if (update.nModified != 0 ){
    console.log(update)
    result = true 
  res.json({result, wishlist})
  } else {
    res.json({result})
  }
});

router.get("/AllPalettes", async (req, res, next) => {
  var result = false;
  var AllPalettes = await paletteModel.find();

  if (AllPalettes) {
    result = true;
    res.json({ result, AllPalettes});
  } else {
    res.json({ result });
  }

  
});

module.exports = router;
