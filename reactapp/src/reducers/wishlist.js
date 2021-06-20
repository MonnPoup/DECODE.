// Ajout, Suppression dans le store d'un article de la wishlist + destruction de la wishlist

export default function Wishlist (wishlist = [], action) {
  if (action.type === "addWishlist") {
    return action.wishlist;
  }
  if (action.type === "deleteArticle") {
    var wishlistCopy = [...wishlist];
    var position = action.index;
    if (position != null) {
      wishlistCopy.splice(position, 1);
    }
    return wishlistCopy;
  } else if (action.type === "deleteWishlist") {
    var wishlistCopyDel = [];
    return wishlistCopyDel;
  } else {
    return wishlist;
  }
}
