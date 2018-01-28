import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { store } from "./redux/store/index";
import { BrowserRouter as Router } from "react-router-dom";


import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker'

// /beertionary/build/
ReactDOM.render(
    <Provider store={store}>
        <Router basename="/beertionary/build/">
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
