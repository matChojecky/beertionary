import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import BeerList from '../components/BeerList/BeerList';
import BeerModal from '../components/BeerModal/BeerModal';
export default class MainPage extends Component {
    
    render() {
        return (
            [
                <BeerList />, 
                <Route path="/beer/:id" component={BeerModal} />
            ]
        )

    }
}