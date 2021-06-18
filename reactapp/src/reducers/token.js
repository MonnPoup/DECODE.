export default function (token = null, action) {
  if (action.type === "addToken") {
    return action.token;
  }
  if (action.type === "deconnexion") {
    return (token = null);
  } else {
    return token;
  }
}
