import React from "react";
import "./App.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import { Badge } from "antd";

function NavBar(props) {
  
  //Nom de l'utilisateur présent dans le store
  const text = <span>Bonjour {props.userNameFromStore}</span>;
  
  // Contenu de la popover si connecté
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

  if (props.token != null) {
    var userNav = (
      <Popover
        placement="bottomRight"
        title={text}
        content={content}
        trigger="hover"
      >
        <img
          src="user.svg"
          alt="user icon"
          style={{ width: "30px", margin: "20px" }}
        />
      </Popover>
    );
  } else {
    userNav = (
      <Link to="/login">
        <img
          src="user.svg"
          alt="user icon"
          style={{ width: "30px", margin: "20px", cursor: "pointer" }}
        />
      </Link>
    );
  }
  var count = props.wishlist.length;
  return (

    //Navbar
    <div className="navbarNormal">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link style={{ textDecoration: "none" }} to="/">
          <h2
            style={{
              margin: "0px 0px 0px 20px",
              color: "#203126",
              fontSize: "50px",
            }}
          >
            DÉCODE.
          </h2>
        </Link>
      </div>
      <div className="icon">
        <Link to="/allpalettes">
          <img
            src="palette.svg"
            alt="palette icon"
            style={{ width: "30px", margin: "20px" }}
          />
        </Link>
        <div style={{ margin: "20px" }}>
          <Badge count={count} style={{ backgroundColor: "#A7430A" }}>
            <Link to="/wishlist">
              <img src="heart.svg" alt="heart icon" style={{ width: "30px" }} />
            </Link>
          </Badge>
        </div>
        {userNav}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    token: state.token,
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
