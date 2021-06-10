import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';


import token from './reducers/token'
import palette from './reducers/palette'
import wishlist from './reducers/wishlist'
import userName from './reducers/user'


import Home from './ScreenHome';
import Quiz from './ScreenQuizz';
import MyPalette from './ScreenMyPalette';

import ShoppingList from './ScreenShoppingList';
import Login from './ScreenLogin';
import Wishlist from './ScreenWishlist'
import AllPalettes from './ScreenAllPalettes'
import NavBar from './navbar'
import NavbarFixed from './navbarFixed'


import { CookiesProvider } from 'react-cookie'

const store = createStore(combineReducers({token, palette, wishlist, userName}))

function App() {

  return (
    <CookiesProvider> 
    <Provider store={store}>
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/quiz" component={Quiz}  />
      <Route exact path="/mypalette" component={MyPalette}  />
      <Route path="/shoppinglist" component={ShoppingList}  />
      <Route path="/login" component={Login}  />
      <Route path="/wishlist" component={Wishlist}  />
      <Route path="/allpalettes" component={AllPalettes}  />
      <Route path="/navbar" component={NavBar}  />
      <Route path="/navbarFixed" component={NavbarFixed}  />

    </Switch>
  </Router>
  </Provider>
  </CookiesProvider>
  );
}

export default App;
