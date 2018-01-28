import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.scss';

import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'

import Header from './components/Header/Header';
import MainPage from './pages/MainPage';

fontawesome.library.add(solid);
fontawesome.library.add(regular);
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Route component={MainPage} path='/' />
      </div>
    );
  }
}

export default App;
