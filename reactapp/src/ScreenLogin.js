import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./navbar";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Input } from "antd";

function Login(props) {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [userExists, setUserExists] = useState(false);

  const [listErrorsSignup, setErrorsSignup] = useState([]);
  const [listErrorsSignin, setErrorsSignin] = useState([]);

  //Appel de la route SignUp (Inscription) lors du clic sur le bouton de connexion
  var handleSubmitSignup = async () => {
    const data = await fetch("/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}&paletteFromStore=${props.userPaletteFromStore._id}`,
    });
    const body = await data.json(); // Reception : result, error, saveUser, token

    if (body.result === true) {
      setUserExists(true);
      props.addToken(body.token); // envoi au reduceur du token utilisateur
      props.addUserStoreSignUp(signUpUsername); // envoi au reduceur du pseudo de l'utilisateur
    } else {
      setErrorsSignup(body.error); // renvoi d'une erreur si le result est à false
    }
  };

  //Appel de la route SignIn (Connexion) lors du clic sur le bouton de connexion
  var handleSubmitSignin = async () => {
    const data = await fetch("/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
    });
    const body = await data.json(); // Reception : result, error, user, token

    if (body.result === true) {
      setUserExists(true);
      props.addToken(body.token);
      props.addUserStoreSignIn(body.user.firstName);
      if (props.userPaletteFromStore === "") {
        props.addPalette(body.user.palette); // Si pas de palette dans le store, on recherche la palette de l'utilisateur en BDD
      }
      props.addToWishlist(body.user.wishlist);
    } else {
      setErrorsSignin(body.error);
    }
  };

  // Si l'utilisateur réussi à se connecter, il est redirigé directement sur la page mypalette 
  if (userExists) {
    return <Redirect to="/mypalette" />;
  }
// Map pour afficher les erreurs présentes dans le tableau de l'état
  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return (
      <p style={{ fontSize: "15px", marginBottom: "0px", marginTop: "10px" }}>
        {error}
      </p>
    );
  });

  var tabErrorsSignin = listErrorsSignin.map((error, i) => {
    return (
      <p style={{ fontSize: "15px", marginBottom: "0px", marginTop: "10px" }}>
        {error}
      </p>
    );
  });

  // Fonction permettant d'appuyer sur la touche entrée pour activer le bouton connexion
  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitSignin();
    }
  };
  const handleKeypress2 = (e) => {
    if (e.charCode === 13) {
      handleSubmitSignup();
    }
  };

  return (
    <div className="background">
      <NavBar />
      <div className="containerLogin">
        <h3 className="h3title">Connexion / Inscription</h3>
        <div className="trait2"></div>
        <div className="login">
          <div className="connexion">
            Connexion
            <div className="formLogin">
              <Input
                onChange={(e) => setSignInEmail(e.target.value)}
                type="text"
                name="emailFromFront"
                placeholder="Email"
                className="input_login"
              />
              <div style={{ display: "flex" }}>
                <Input.Password
                  onKeyPress={handleKeypress}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  type="password"
                  name="passwordFromFront"
                  placeholder="Mot de passe"
                  className="input_login"
                />
              </div>
            </div>
            <div>{tabErrorsSignin}</div>
            <input
              onClick={() => handleSubmitSignin()}
              type="submit"
              value="Connexion"
              className="inputValider"
            />
          </div>

          <div className="trait">
            <img src="line.png" alt="line" />
          </div>
          <div className="inscription">
            Inscription
            <div className="formLogin">
              <Input
                onChange={(e) => setSignUpUsername(e.target.value)}
                type="text"
                name="usernameFromFront"
                placeholder="Prénom"
                className="input_login"
              />
              <Input
                onChange={(e) => setSignUpEmail(e.target.value)}
                type="text"
                name="emailFromFront"
                placeholder="Email"
                className="input_login"
              />
              <Input.Password
                onKeyPress={handleKeypress2}
                onChange={(e) => setSignUpPassword(e.target.value)}
                name="passwordFromFront"
                placeholder="Mot de passe"
                className="input_login"
              />
            </div>
            <div>{tabErrorsSignup}</div>
            <input
              onClick={() => handleSubmitSignup()}
              type="submit"
              value="Connexion"
              className="inputValider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { userToken: state.token, userPaletteFromStore: state.palette };
}

function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({ type: "addToken", token: token });
    },
    suppressionToken: function () {
      dispatch({ type: "deconnexion" });
    },
    addUserStoreSignUp: function (userName) {
      dispatch({ type: "userStoreSignUp", userName });
    },
    addUserStoreSignIn: function (userName) {
      dispatch({ type: "userStoreSignIn", userName });
    },
    addPalette: function (palette) {
      dispatch({ type: "addPalette", palette: palette });
    },
    addToWishlist: function (wishlist) {
      dispatch({ type: "addWishlist", wishlist: wishlist });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
