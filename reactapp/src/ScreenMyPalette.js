import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./navbar";
import { connect } from "react-redux";
import copy from "copy-to-clipboard";
import { Popover, notification } from "antd";

function MyPalette(props) {
  const [palette, setPalette] = useState(props.userPaletteFromStore);

  useEffect(() => {
    setPalette(props.userPaletteFromStore);
  }, [props.userPaletteFromStore, props.token]); // Réexecution du useEffect si la valeur d'une des propriétés change

  var handleClickCopyCode = (data) => { //Copier le code hex des couleurs des palettes
    copy(`${data}`, {
      debug: true,
      message: "Press #{key} to copy",
    });
  };

  const openNotification = () => { // Notification informant de la copie
    notification.open({
      message: "Code copié !",
      className: "notifcopy",
      style: {
        width: 200,
      },
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const content = ( 
    <div>
      <p style={{ fontSize: "12px", marginBottom: "0px" }}>
        Cliquez pour copier le code hex
      </p>
    </div>
  );

  if (palette) { // Renomme les palettes
    var paletteName = palette.name;
    if (paletteName === "artDeco") {
      paletteName = "Art Déco".toUpperCase();
    } else if (paletteName === "ethnique") {
      paletteName = "Ethnique".toUpperCase();
    } else if (paletteName === "bohème") {
      paletteName = "Bohème".toUpperCase();
    } else if (paletteName === "modernMinimal") {
      paletteName = "Modern Minimal".toUpperCase();
    }

    var tabPaletteColor = props.userPaletteFromStore.colors.map((data, i) => { //Map des couleurs
      return (
        <Popover //Message pour proposer de copier
          key={i}
          content={content}
          trigger="hover"
          placement="bottomRight"
        >
          <div //Couleurs des palettes
            key={i}
            style={{ backgroundColor: data, cursor: "pointer" }}
            className="palette"
            onClick={() => {
              handleClickCopyCode(data); 
              openNotification();
            }}
          >
            <p className="textColorPalette">{data}</p>
          </div>
        </Popover>
      );
    });

    return (
      <div style={{ height: "110vh" }} className="background">
        <NavBar />
        <div className="containerMypalette">
          <h3 className="h3Mypalette">VOTRE PALETTE : {paletteName} </h3>
          <div className="traitMypalette"></div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {tabPaletteColor}
          </div>
        </div>
        <p className="descriptionMypalette">{palette.description}</p>
        <Link to="/shoppinglist">
          <button className="inputMypalette">Découvrir ma shopping-list</button>
        </Link>
      </div>
    );
  } else {
    return (
      <div style={{ height: "110vh" }} className="background">
        <NavBar />
        <div className="containerMypalette">
          <h3 className="h3Mypalette">VOTRE PALETTE : </h3>
          <div className="traitMypalette"></div>
          <div style={{ display: "flex", flexDirection: "row" }}></div>
        </div>
        <p className="descriptionMypalette"></p>
        <Link to="/shoppinglist">
          <button className="inputMypalette">Découvrir ma shopping-list</button>
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { userPaletteFromStore: state.palette, token: state.token };
}


export default connect(mapStateToProps, null)(MyPalette);
