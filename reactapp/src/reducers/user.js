export default function(userName = null, action){
    if(action.type === 'userStoreSignUp'){
    var userToUpperCase = action.userName[0].toUpperCase() + action.userName.slice(1)
        return userToUpperCase
    } if (action.type === 'userStoreSignIn') {
    var userToUpperCaseSignIn = action.userName[0].toUpperCase() + action.userName.slice(1)
        return userToUpperCaseSignIn
    }
    else {
        return userName
    }
}