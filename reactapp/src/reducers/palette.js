//Ajout et Suppression d'une palette dans le store 
export default function Palette (palette = "", action) {
  if (action.type === "addPalette") {
    var addPaletteCopy = action.palette;
    return addPaletteCopy;
  } else if (action.type === "deletePalette") {
    var copy = "";
    return copy;
  } else {
    return palette;
  }
}
