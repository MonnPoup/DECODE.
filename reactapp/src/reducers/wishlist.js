export default function(wishlist = [], action){
    if(action.type === 'addWishlist'){
        return action.wishlist
    } 
    if (action.type === 'deleteArticle')
    var wishlistCopy = [...wishlist]
   var position = action.index
    if( position != null){
        wishlistCopy.splice(position,1)
        return wishlistCopy
    } else if (action.type === "deleteWishlist") {
        console.log('wishlist vidée')
        var wishlistCopy = []
        return wishlistCopy
    }
     else {
        return wishlist
    }
}