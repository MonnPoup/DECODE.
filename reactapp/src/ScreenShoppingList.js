import React, {useState, useEffect} from 'react';
import { Link, Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col } from 'react-bootstrap';
import { connect } from "react-redux";
import NavbarFixed from './navbarFixed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Popover, Button, Checkbox } from 'antd';
import { Form, FormGroup, Label, Input } from 'reactstrap';



function ShoppingList(props) {
const [userPalette, setUserPalette] = useState(props.userPaletteFromStore)
const [articleList, setArticleList] = useState([])
const [articleListFromBDD, setArticleListFromBDD] = useState([])
const [isLiked, setIsLiked] = useState(false)
const [wishlist, setWishlist] = useState(props.userWishlist)
const [FilterDeco, setFilterDeco]= useState(false)
const [FilterMobilier, setFilterMobilier] = useState(false)
const [stateDeco, setStateDeco] = useState(false)
const [stateMob, setStateMob] = useState(false)

var likeColor = ''

useEffect(() => {
  if (props.token) {
  async function wishlistData() {
    const rawResponse = await fetch('/wishlist', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `token=${props.token}`
    })
    const body = await rawResponse.json()
   setWishlist(body.wishlist)
   props.addToWishlist(body.wishlist)
  }
  wishlistData() }
},[]) 

////////// CHERCHER LES ARTICLES EN BDD  //////////
useEffect( () => {
  
  async function loadData() { 
    const rawResponse = await fetch('/myShoppingList', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `paletteName=${userPalette.name}`
    })
    const body = await rawResponse.json()
    setArticleList(body.shoppingList)
    setArticleListFromBDD(body.shoppingList)  // Mettre les articles dans un état ArticleList
  }
  loadData()
  
 }, []);

 

 useEffect( () => {
  setWishlist(props.wishlist)
  console.log('wishlist from store', props.wishlist)
 }, [props.wishlist]);


 ////////// AJOUTER OU SUPPRIMER UN ARTICLE EN WISHLIST  //////////
 var handleClickWishList = (articleID) => {
  
      var resultFilter = wishlist.find(wishlist => wishlist._id === articleID)

      if (!resultFilter) { 
      async function addToWishlist() {
        const rawResponse = await fetch('/addToWishlist', {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `token=${props.token}&articleID=${articleID}`,
        })
        const response = await rawResponse.json()
        console.log('rajouté', response.wishlist)
        props.addToWishlist(response.wishlist)
      }
      addToWishlist()

      } else { 
        console.log('supprime')
      async function deleteArticle() {
        const deleteArticle = await fetch('/deleteFromWishlist', {
          method: 'PUT',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: `token=${props.token}&articleID=${articleID}`,
        })
        const updateWishlist = await deleteArticle.json()
        console.log('update', updateWishlist)
        props.addToWishlist(updateWishlist.wishlist)
      }
      deleteArticle()
      } 
  }  

 ////////////////// MAP DES ARTICLES TROUVES EN BDD /////////////////
 if (props.userPaletteFromStore === '' ) {        // si il n'y a rien dans la liste d'article, l'utilsateur n'a pas fait le quizz, donc redirect home
return ( <Redirect to='/' /> )
} else 
{
  var displayArticles = articleList.map((article, i) => {
   
    var wishlistFilter = props.wishlist.find(wishlist => wishlist.merchantUrl === article.merchantUrl)
    

    if (wishlistFilter) { 
    likeColor =  "#A7430A"} else {
      likeColor = "#000000"
    }
  
      /////// pop over si pas connecté ////// 
 if (!props.token){
  var popoverWishList = <Popover placement="bottomRight" content='Veuillez vous connecter pour ajouter un article à votre Wishlist' trigger="click">
    <FontAwesomeIcon style={{cursor:'pointer', width: '15px'}} icon={faHeart}/>
    </Popover>
} else {
 popoverWishList = <FontAwesomeIcon onClick={() => handleClickWishList(article._id)} style={{cursor:'pointer', width: '15px'}} icon={faHeart} color={likeColor} />
}  
  

  return ( 
   <Col key={i} md={2}lg={3} className="articleCard" > 
    <a href={article.merchantUrl} target="_blank">
    <div  className='productImage' >
      <img style={{maxWidth:'100%', maxHeight: '100%'}} src={article.imageUrl}  alt='product' /> 
      {/* image + picto coeur  */}
    </div>
    </a>
    <div className="productInfo" > 
      <div className="cardPartLeft"> 
        <a href={article.merchantUrl} target="_blank">
          <h5 className='articleCardTitle'> {article.name} </h5> 
        </a>
        <h6 className='articleCardBrand'> {article.brand} </h6>
      </div>
      <div className="cardPartRight" > 
        {popoverWishList}
        <p className='articleCardTitle'> {article.price}€ </p>
      </div>
    </div>
    
  </Col>
  
  )
})
  
/// Map des couleurs de la palette //// 
  var displayPalette = userPalette.colors.map((color, i) => {
    return (
    <div key={i} className='color1' style={{height:'50px', width:'50px', backgroundColor:`${color}`}}> 
    </div>) }
    )

   
   /// map des inspirations /// 
  var displayInspo = userPalette.inspirations.map((photo, i) => {
    const content = (
      <img className="displayInspo" style={{minWidth:'400px', minHeight:'400px', maxWidth:'600px', maxHeight: '600px'}} src={photo} alt='inspo'/>
      )
    return (
      <Popover content={content} placement='right' >
      <Col key={i} md={2}lg={3}  style={{backgroundColor:'white', margin:'10px', display:'flex'}}>
        <div  style={{height: '100%',display: 'flex' , justifyContent:'center', alignItems: 'center'}}>
          <img style={{maxWidth:'100%', maxHeight: '100%'}} src={photo} alt='inspo'/>
        </div>
      </Col>
      </Popover>
      )}
      ) 
    
      if (props.userPaletteFromStore) {
        var paletteName = props.userPaletteFromStore.name;
        if (paletteName === "artDeco") {
          paletteName = "Art Déco".toUpperCase();
        } else if (paletteName === "ethnique") {
          paletteName = "Ethnique".toUpperCase();
        } else if (paletteName === "bohème") {
          paletteName = "Bohème".toUpperCase();
        } else if (paletteName === "modernMinimal") {
          paletteName = "Modern Minimal".toUpperCase();
        } }

//////////////// FILTER  ////////////////

function onChangeDécoration(e) {
  setArticleList(articleListFromBDD)
  setFilterDeco(e.target.checked)
}
function onChangeMobilier(e) {
  setArticleList(articleListFromBDD)
  setFilterMobilier(e.target.checked)
  
}

if (FilterDeco === true ) {
  setStateMob(false)
  setStateDeco(true)
  var resultFilterDeco = articleList.filter(article => article.category === "décoration")
  setArticleList(resultFilterDeco)
  setFilterDeco(false)
  

}

if (FilterMobilier === true ) {
  setStateDeco(false)
  setStateMob(true)
  var resultFilterMob = articleList.filter(article => article.category === "mobilier")
  setArticleList(resultFilterMob)
  setFilterMobilier(false)
}

var handleClickReset = () => {
  setArticleList(articleListFromBDD)
  setStateDeco(false)
  setStateMob(false)
  setFilterMobilier(false)
  setFilterDeco(false)
}

var content = (
  <div style={{backgroundColor:'#fcfbf6'}}> 
    <h6 className="h6filter"> CATÉGORIES </h6>
  <Checkbox  checked={stateMob} onChange={onChangeMobilier}>Mobilier</Checkbox>
  <Checkbox  checked={stateDeco} onChange={onChangeDécoration}>Décoration</Checkbox>
  <p style={{color: 'grey', textDecoration: 'underline grey', marginBottom:'0px', textAlign:'center', cursor:'pointer'}} onClick={()=> handleClickReset()}> Réinitialiser le filtre </p>
  </div>
)



  return (
    <div  className="background">     {/* FOND  */}
      <NavbarFixed />
    <div style={{height: '17vh', backgroundColor: '#203126'}}></div>  {/* trait vert */}

  {/* CONTAINER ARTICLES */}
    <div className="ContainerShoppingList" style={{dislpay:'flex', backgroundColor:'#FCFBF6', paddingBottom:'3vh', justifyContent:'center' }}>  

  {/* PALETTE + BOUTON REFAIRE QUIZZ */}
        <div style={{display:'flex', justifyContent:'space-between', paddingTop:'11px'}}> 
          <div className="PaletteColors"> 
            {displayPalette}
          </div>
          <Link to="/quiz">
            <button className="inputShoppingList">Refaire le questionnaire</button>
          </Link>
        </div>

  {/* SELECTION D'ARTICLE */}
        <div className='ArticleShoppingList' > 
          <div className="ShoppingList-Text"> 
            <h4  className="TitleShoppingListContainer">
            VOTRE SHOPPING LIST {paletteName}</h4>

            {/* FILTRER  */}
            <Popover overlayStyle={{backgroundColor:"#fcfbf6"}} content={content} placement='bottom' >
            <Button id="Popover1" type="button" > 
              <FontAwesomeIcon style={{cursor:'pointer', width: '15px'}} icon={faSearch}/>
              Filtrer
            </Button>
            </Popover>
          </div>
  
      {/* SLIDER */}  
          <div className="scrollerShoppingList " > 
            <Container className="containerArticles" lg={12} md={12} > 
              <Row  className="rowArticles" lg={12} md={12}> 
                {displayArticles}
              </Row>
            </Container> 
          </div>   {/* fin div slider */}
        </div> {/* fin article */}
      </div> {/* fin shopping list */}


  {/* BOUTTON SCROLL */}
    <div className="scrollShoppingList" >
      <h5 className='textShoppingList'>Découvrir des photos d'inspiration</h5>
      <a href="#sect2">
        <img className="arrowShoppingList" src="doubleChevron.svg" alt="double chevron" />
      </a>
    </div>


{/* PARTIE INSPIRATION */}
    <div id='sect2' className="ContainerInspi" >
      <div className="Inpiration-Text" > 
      <h4 className="TitleShoppingListContainer" style={{paddingTop:"18vh"}}> INSPIRATIONS </h4>
      </div>

      <div className="Inspirations-DisplayPhoto"> 
        <Container className='containerPhotoInspi' lg={12} md={12} > 
            <Row  className='rowPhotoInspi' lg={12} md={12} > 
              {displayInspo}
            </Row>
        </Container>
      </div>
    </div> {/* fin div inspiration  */}

    </div> /* fin div background */
  

  
  );
   
}}

function mapStateToProps(state) {
  return { userPaletteFromStore: state.palette, token: state.token, wishlist: state.wishlist };
}

function mapDispatchToProps(dispatch){
  return {
    suppressionToken: function(){
        dispatch({type: 'deconnexion'})
    },
    addToWishlist: function(wishlist){
      dispatch({type: 'addWishlist', wishlist:wishlist})
  },
  }
}

export default connect (
  mapStateToProps,
  mapDispatchToProps)
  (ShoppingList)


