// Ajout au store du pseudo de l'utilisateur lors de sa connexion et de son inscription 
export default function User (userName = null, action) {
  if (action.type === "userStoreSignUp") {
    var userToUpperCase =
      action.userName[0].toUpperCase() + action.userName.slice(1);
    return userToUpperCase;
  }
  if (action.type === "userStoreSignIn") {
    var userToUpperCaseSignIn =
      action.userName[0].toUpperCase() + action.userName.slice(1);
    return userToUpperCaseSignIn;
  } else {
    return userName;
  }
}
