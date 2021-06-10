import React, { useState, useEffect } from "react";
import NavBar from "./navbar";
import AllPaletteModel from "./AllPaletteModel";


function AllPalettes() {

const [allPalettes, setAllPalettes] = useState([])
const [allArticles, setAllArticles] = useState([])

  useEffect(() => {
async function loadPalette() {
  var rawResponse = await fetch('/AllPalettes');
  var response = await rawResponse.json();
  console.log('reception palette back', response.AllPalettes);
  setAllPalettes(response.AllPalettes)
} loadPalette();

}, []);
console.log('hello', allPalettes);

 var TabAllPalettes = allPalettes.map((data, i) => {

  var paletteName = data.name;
  if (paletteName === "artDeco") {
    paletteName = "Art Déco";
  } else if (paletteName === "ethnique") {
    paletteName = "Éthnique";
  } else if (paletteName === "bohème") {
    paletteName = "Bohème";
  } else if (paletteName === "modernMinimal") {
    paletteName = "Modern Minimal";
  } 

    return (
      <div>
      <AllPaletteModel key={i} name= {paletteName} inspirations={data.inspirations} colors={data.colors}/>
      </div>
      )
   })
   
 
 
  return (
    <div className="background">
      <NavBar />
      <h3 className="h3AllPalettes">TOUTES LES PALETTES</h3>
      <div className="traitAllPalettes"></div>
     {TabAllPalettes}
    </div>
  );
}

export default AllPalettes;
