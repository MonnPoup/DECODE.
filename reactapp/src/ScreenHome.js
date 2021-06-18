import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { connect } from "react-redux";
import { Popover } from "antd";
import "rc-texty/assets/index.css";
import { Badge } from "antd";

function Home(props) {
  const text = <span>Bonjour {props.userNameFromStore}</span>;
  const content = (
    <div>
      <Link
        style={{ color: "grey", textDecoration: "underline grey" }}
        to="/mypalette"
      >
        <p>Ma palette</p>
      </Link>
      <Link
        style={{ color: "grey", textDecoration: "underline grey" }}
        to="/shoppinglist"
      >
        <p>Ma shopping list</p>
      </Link>
      <Link style={{ color: "grey", textDecoration: "underline grey" }} to="/">
        <p
          onClick={() => {
            props.suppressionToken();
            props.deleteWishlist();
            props.deletePalette();
          }}
        >
          Déconnexion
        </p>
      </Link>
    </div>
  );

  if (props.userToken != null) {
    var popover = (
      <Popover
        placement="bottomRight"
        title={text}
        content={content}
        trigger="hover"
      >
        <img
          src="user.svg"
          alt="heart icon"
          style={{ width: "30px", margin: "20px" }}
        />
      </Popover>
    );
  } else {
    popover = (
      <Link to="/login">
        <img
          src="user.svg"
          alt="heart icon"
          style={{ width: "30px", margin: "20px" }}
        />
      </Link>
    );
  }

  var count = props.wishlist.length;

  return (
    <div className="mycontainer" style={{ scrollBehavior: "smooth" }}>
      <div className="navbarHome">
        <div>
          <Link style={{ textDecoration: "none" }} to="/">
            <h1
              type="alpha"
              duration="150"
              mode="random"
              style={{
                marginLeft: "20px",
                marginTop: "60px",
                fontSize: "70px",
                color: "#203126",
              }}
            >
              DÉCODE.
            </h1>
          </Link>
        </div>
        <div className="icon">
          <Link to="/allpalettes">
            <img
              src="palette.svg"
              alt="user icon"
              style={{ width: "30px", margin: "20px" }}
            />
          </Link>
          <div style={{ margin: "20px" }}>
            <Badge count={count} style={{ backgroundColor: "#A7430A" }}>
              <Link to="/wishlist">
                <img
                  src="heart.svg"
                  alt="heart icon"
                  style={{ width: "30px" }}
                />
              </Link>
            </Badge>
          </div>
          {popover}
        </div>
      </div>
      <div
        id="section1"
        className="imageBackground"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          className="titreHomeSection1"
          style={{
            width: "50vw",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <p
            id="pHome"
            data-mdb-toggle="animation"
            data-mdb-animation-reset="true"
            data-mdb-animation="fade-in-down"
          >
            DÉCOUVREZ L'INTÉRIEUR DONT VOUS AVEZ TOUJOURS RÊVÉ
          </p>
        </div>
        <a href="#section2">
          <div
            type="button"
            className="ButtonHome1"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p style={{ marginTop: "1em" }}> Je découvre</p>
          </div>
        </a>
        <div className="paletteNoire"></div>
        <div className="paletteBrune"></div>
        <div className="paletteBleue"></div>
        <div className="paletteOr"></div>
        <div className="paletteBlanc"></div>
        <a href="#section2">
          <img
            className="chevronBlanc"
            src="doubleChevron.svg"
            alt="double chevron"
          />
        </a>
      </div>
      <div id="section2" className="background">
        <a href="#section1">
          <img
            className="chevronBlanc2"
            src="doubleChevron.svg"
            alt="double chevron"
          />
        </a>
        <div
          className="titreHomeSection2"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p className="pHome1">
            DÉCODE vous offre des conseils de décoration personnalisés et
            gratuits afin de vous accompagner dans vos projets déco.
          </p>
          <p className="pHome1">
            Répondez au questionnaire pour découvrir votre palette de couleurs
            et accéder à votre shopping list sur-mesure !
          </p>
        </div>
        <Link to="/quiz">
          <button type="button" className="ButtonHome2">
            Répondre au questionnaire
          </button>
        </Link>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userToken: state.token,
    userNameFromStore: state.userName,
    wishlist: state.wishlist,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    suppressionToken: function () {
      dispatch({ type: "deconnexion" });
    },
    deleteWishlist: function () {
      dispatch({ type: "deleteWishlist" });
    },
    deletePalette: function () {
      dispatch({ type: "deletePalette" });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
