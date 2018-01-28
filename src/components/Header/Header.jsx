import React from 'react';
import { Link } from 'react-router-dom';
import beerIcon from '../../assets/pint-of-beer.svg'
import { connect } from "react-redux";
import './Header.scss';

import { fetchNextPage, showOnlyLikedBeers, searchValueChange } from '../../redux/actions/index';

const mapStateToProps = state => {
    return { isFetching: state.isFetching, canFetch: state.canFetch, isNotSearching: !state.searchByName }
};
const mapDispatchToProps = dispatch => {
    return {
        showOnlyLikedBeers: (filter) => { dispatch(showOnlyLikedBeers(filter)) },
        searchValueChange: (value) => { dispatch(searchValueChange(value)) },
        fetchNextPage: () => { dispatch(fetchNextPage()) }
    };
};
let likedCheckbox;
let fetchingInterval = null;


const Header = ({...props}) => {
    if(fetchingInterval && (!props.canFetch || props.isNotSearching)) { clearInterval(fetchingInterval); fetchingInterval = null; }
    return (
    <nav className="navbar" aria-label="main navigation">
            <div className="navbar-brand navbar-start">
                <Link className="navbar-item brand-elements" to="/">
                        <img src={beerIcon} alt="" className="image" height={'100px'}/>
                        <h1 className="title">Beertionary</h1>
                </Link>
            </div>
            <div className="navbar-item navbar-end">
                <div className="field">
                    <div className="control">
                        <input className="input is-warning" type="text" placeholder="Search beer by name..." onChange={(evt) => {
                            props.searchValueChange(evt.target.value);
                            if(!fetchingInterval && props.canFetch) {
                                fetchingInterval = setInterval(() => {
                                    if(!props.isFetching) {
                                        props.fetchNextPage();
                                    } else if (!props.canFetch) {
                                        clearInterval(fetchingInterval);
                                    }
                                }, 2000);
                            }
                        }} />
                    </div>
                </div>
                <div className="pretty p-switch p-fill only-liked">
                    <input id="only-liked-checkbox" type="checkbox"  ref={(_check) => { likedCheckbox = _check; }} onChange={() => { props.showOnlyLikedBeers(likedCheckbox.checked); }} />
                    <div className="state p-warning">
                        <label htmlFor="only-liked-checkbox">Show only liked beers</label>
                    </div>
                </div>
            </div>
    </nav>
)};

export default connect(mapStateToProps, mapDispatchToProps)(Header);