export default function (palette = "", action) {
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
