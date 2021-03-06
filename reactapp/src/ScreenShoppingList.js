import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import NavbarFixed from "./navbarFixed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Popover, Button, Checkbox } from "antd";

function ShoppingList(props) {
  const [articleList, setArticleList] = useState([]);
  const [articleListFromBDD, setArticleListFromBDD] = useState([]);
  const [wishlist, setWishlist] = useState(props.userWishlist);
  const [FilterDeco, setFilterDeco] = useState(false);
  const [FilterMobilier, setFilterMobilier] = useState(false);
  const [stateDeco, setStateDeco] = useState(false);
  const [stateMob, setStateMob] = useState(false);
  var userPalette = props.userPaletteFromStore;
  var likeColor = "";

  //Chargement des articles liés à la palette
  useEffect(() => {
    async function loadData() {
      const rawResponse = await fetch("/myShoppingList", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `paletteName=${userPalette.name}`,
      });
      const body = await rawResponse.json();
      setArticleList(body.shoppingList); //Liste d'articles 1
      setArticleListFromBDD(body.shoppingList); // Liste d'articles 2
    }
    loadData();
  }, []);

  useEffect(() => {
    setWishlist(props.wishlist); // Mise à jour de l'état wishlist lors d'un changement dans la wishlist du store
  }, [props.wishlist]);

  ////////// AJOUTER OU SUPPRIMER UN ARTICLE EN WISHLIST  //////////

  var handleClickWishList = (articleID) => {
    // on va chercher l'id d'un article en fonction de celui sur lequel on vient de cliquer
    var resultFilter = wishlist.find((wishlist) => wishlist._id === articleID);

    if (!resultFilter) {
      // si rien n'est trouvé on ajoute l'article à la wishlist
      async function addToWishlist() {
        const rawResponse = await fetch("/addToWishlist", {
          //appel route addToWishlist
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `token=${props.token}&articleID=${articleID}`,
        });
        const response = await rawResponse.json();

        props.addToWishlist(response.wishlist); //envoi de la nouvelle wishlist dans le store
      }
      addToWishlist();
    } else {
      async function deleteArticle() {
        //si trouvé, on supprime
        const deleteArticle = await fetch("/deleteFromWishlist", {
          //appel route deleteFromWishlist
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `token=${props.token}&articleID=${articleID}`,
        });
        const updateWishlist = await deleteArticle.json();
        props.addToWishlist(updateWishlist.wishlist); //envoi de la nouvelle wishlist dans le store
      }
      deleteArticle();
    }
  };

  ////////////////// MAP DES ARTICLES TROUVES EN BDD /////////////////

  if (userPalette === "") {
    // s'il n'y a rien dans la liste d'article, l'utilsateur n'a pas fait le quizz, donc redirect home
    return <Redirect to="/" />;
  } else {
    var displayArticles = articleList.map((article, i) => {
      var wishlistFilter = props.wishlist.find(
        (wishlist) => wishlist.merchantUrl === article.merchantUrl //On va chercher si l'article que l'on map est présent dans la wishlist :
      );

      if (wishlistFilter) {
        likeColor = "#A7430A"; // Si c'est le cas, on met le coeur en rouge
      } else {
        likeColor = "#000000"; // Sinon en blanc
      }

      if (!props.token) {
        //Popover prévenant qu'il faut se connecter pour accéder à la wishlist
        var popoverWishList = (
          <Popover
            placement="bottomRight"
            content="Veuillez vous connecter pour ajouter un article à votre Wishlist"
            trigger="click"
          >
            <FontAwesomeIcon
              style={{ cursor: "pointer", width: "15px" }}
              icon={faHeart}
            />
          </Popover>
        );
      } else {
        popoverWishList = (
          <FontAwesomeIcon
            onClick={() => handleClickWishList(article._id)}
            style={{ cursor: "pointer", width: "15px" }}
            icon={faHeart}
            color={likeColor}
          />
        );
      }

      return (
        // Contenu d'une div article
        <Col key={i} md={2} lg={3} className="articleCard">
          <a href={article.merchantUrl} target="_blank" rel="noreferrer">
            <div className="productImage">
              <img
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                src={article.imageUrl}
                alt="product"
              />
            </div>
          </a>
          <div className="productInfo">
            <div className="cardPartLeft">
              <a href={article.merchantUrl} target="_blank" rel="noreferrer">
                <h5 className="articleCardTitle"> {article.name} </h5>
              </a>
              <h6 className="articleCardBrand"> {article.brand} </h6>
            </div>
            <div className="cardPartRight">
              {popoverWishList}
              <p className="articleCardTitle"> {article.price}€ </p>
            </div>
          </div>
        </Col>
      );
    });

    /// Map des couleurs de la palette ////
    var displayPalette = userPalette.colors.map((color, i) => {
      return (
        <div
          key={i}
          className="color1"
          style={{ height: "50px", width: "50px", backgroundColor: `${color}` }}
        ></div>
      );
    });

    /// map des inspirations ///
    var displayInspo = userPalette.inspirations.map((photo, i) => {
      const content = (
        <img
          className="displayInspo"
          style={{
            minWidth: "400px",
            minHeight: "400px",
            maxWidth: "600px",
            maxHeight: "600px",
          }}
          src={photo}
          alt="inspo"
        />
      );
      return (
        <Popover content={content} placement="right">
          <Col
            key={i}
            md={2}
            lg={3}
            style={{
              backgroundColor: "white",
              margin: "10px",
              display: "flex",
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                src={photo}
                alt="inspo"
              />
            </div>
          </Col>
        </Popover>
      );
    });

    if (userPalette) {
      var paletteName = props.userPaletteFromStore.name;
      if (paletteName === "artDeco") {
        paletteName = "Art Déco".toUpperCase();
      } else if (paletteName === "ethnique") {
        paletteName = "Ethnique".toUpperCase();
      } else if (paletteName === "bohème") {
        paletteName = "Bohème".toUpperCase();
      } else if (paletteName === "modernMinimal") {
        paletteName = "Modern Minimal".toUpperCase();
      }
    }

    //////////////// FILTER  ////////////////

    function onChangeDécoration(e) {
      setArticleList(articleListFromBDD); // reset de la liste d'articles
      setFilterDeco(e.target.checked); //booléen passe à true
    
    }
    function onChangeMobilier(e) {
      setArticleList(articleListFromBDD); // reset de la liste d'articles
      setFilterMobilier(e.target.checked); //booléen passe à true
    }

    if (FilterDeco === true) {
      setStateMob(false);
      setStateDeco(true); //checked
      var resultFilterDeco = articleList.filter(
        (article) => article.category === "décoration" // filtre en fonction de la catégorie
      );
      setArticleList(resultFilterDeco); // Maj de la liste d'articles 
      setFilterDeco(false);
    }

    if (FilterMobilier === true) {
      setStateDeco(false);
      setStateMob(true); //checked 
      var resultFilterMob = articleList.filter(
        (article) => article.category === "mobilier" // filtre en fonction de la catégorie
      );
      setArticleList(resultFilterMob); // Maj de la liste d'articles
      setFilterMobilier(false);
    }

    var handleClickReset = () => { //reset global
      setArticleList(articleListFromBDD); 
      setStateDeco(false);
      setStateMob(false);
      setFilterMobilier(false);
      setFilterDeco(false);
    };

    var content = (
      <div style={{ backgroundColor: "#fcfbf6" }}>
        <h6 className="h6filter"> CATÉGORIES </h6>
        <Checkbox checked={stateMob} onChange={onChangeMobilier}>
          Mobilier
        </Checkbox>
        <Checkbox checked={stateDeco} onChange={onChangeDécoration}>
          Décoration
        </Checkbox>
        <p
          style={{
            color: "grey",
            textDecoration: "underline grey",
            marginBottom: "0px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => handleClickReset()}
        >
          Réinitialiser le filtre
        </p>
      </div>
    );

    return (
      <div className="background">
        {" "}
        {/* FOND  */}
        <NavbarFixed />
        <div style={{ height: "17vh", backgroundColor: "#203126" }}></div>{" "}
        {/* trait vert */}
        {/* CONTAINER ARTICLES */}
        <div
          className="ContainerShoppingList"
          style={{
            dislpay: "flex",
            backgroundColor: "#FCFBF6",
            paddingBottom: "3vh",
            justifyContent: "center",
          }}
        >
          {/* PALETTE + BOUTON REFAIRE QUIZZ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "11px",
            }}
          >
            <div className="PaletteColors">{displayPalette}</div>
            <Link to="/quiz">
              <button className="inputShoppingList">
                Refaire le questionnaire
              </button>
            </Link>
          </div>
          {/* SELECTION D'ARTICLE */}
          <div className="ArticleShoppingList">
            <div className="ShoppingList-Text">
              <h4 className="TitleShoppingListContainer">
                VOTRE SHOPPING LIST {paletteName}
              </h4>

              {/* FILTRER  */}
              <Popover
                overlayStyle={{ backgroundColor: "#fcfbf6" }}
                content={content}
                placement="bottom"
              >
                <Button id="Popover1" type="button">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer", width: "15px" }}
                    icon={faSearch}
                  />
                  Filtrer
                </Button>
              </Popover>
            </div>
            {/* SLIDER */}
            <div className="scrollerShoppingList ">
              <Container className="containerArticles" lg={12} md={12}>
                <Row className="rowArticles" lg={12} md={12}>
                  {displayArticles}
                </Row>
              </Container>
            </div>{" "}
            {/* fin div slider */}
          </div>{" "}
          {/* fin article */}
        </div>{" "}
        {/* fin shopping list */}
        {/* BOUTTON SCROLL */}
        <div className="scrollShoppingList">
          <h5 className="textShoppingList">
            Découvrir des photos d'inspiration
          </h5>
          <a href="#sect2">
            <img
              className="arrowShoppingList"
              src="doubleChevron.svg"
              alt="double chevron"
            />
          </a>
        </div>
        {/* PARTIE INSPIRATION */}
        <div id="sect2" className="ContainerInspi">
          <div className="Inpiration-Text">
            <h4
              className="TitleShoppingListContainer"
              style={{ paddingTop: "18vh" }}
            >
              {" "}
              INSPIRATIONS{" "}
            </h4>
          </div>

          <div className="Inspirations-DisplayPhoto">
            <Container className="containerPhotoInspi" lg={12} md={12}>
              <Row className="rowPhotoInspi" lg={12} md={12}>
                {displayInspo}
              </Row>
            </Container>
          </div>
        </div>{" "}
        {/* fin div inspiration  */}
      </div> /* fin div background */
    );
  }
}

function mapStateToProps(state) {
  return {
    userPaletteFromStore: state.palette,
    token: state.token,
    wishlist: state.wishlist,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    suppressionToken: function () {
      dispatch({ type: "deconnexion" });
    },
    addToWishlist: function (wishlist) {
      dispatch({ type: "addWishlist", wishlist: wishlist });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);
