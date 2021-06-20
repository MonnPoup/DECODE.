//Ajout et Suppression d'un token dans le store 
export default function Token (token = null, action) {
  if (action.type === "addToken") {
    return action.token;
  }
  if (action.type === "deconnexion") {
    return (token = null);
  } else {
    return token;
  }
}
