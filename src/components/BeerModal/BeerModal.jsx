import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { connect } from "react-redux";
import { fetchNextPage } from '../../redux/actions/index';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Loader from '../Loader/Loader.jsx';
import './BeerModal.scss';

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const mapStateToProps = state => {
    const test = new RegExp(`(${window.location.origin}/beer/(\\d+).*)`);
    const beerId = parseInt(window.location.href.replace(test, "$2"), 10);
    const beer = state.beerData.find(beer => beer.id === beerId);
    const beersData = state.beerData;
    return {
        beer,
        canFetch: state.canFetch,
        isFetching: state.isFetching,
        beersData,
    }
};
const mapDispatchToProps = dispatch => {
    return {
      fetchNextPage: () => { dispatch(fetchNextPage()) }
    };
  };


class BeerModal extends Component {
    constructor(props) {
        super(props);
        const likedBeers = JSON.parse(localStorage.getItem('likedBeers')) || [];
        const isFavorito = this.props.beer ? likedBeers.includes(this.props.beer.id) : false;
        this.state = {
            likedBeers,
            isFavorito,
            iconPrefix: isFavorito ? 'fas' : 'far',
            suggestedBeers: []
        };

        this.handleLikedBeer = this.handleLikedBeer.bind(this);
    }

    componentWillMount() {
        document.body.classList.add('stop-scrolling');
    }
    componentWillUpdate(nextProps) {
        // console.log(nextProps);
        // if(!(nextProps.beer || nextProps.isFetching)) {
        //     this.props.fetchNextPage();
        // }
    }
    componentWillUnmount() {
        document.body.classList.remove('stop-scrolling');

    }

    handleLikedBeer() {
        if(!this.state.isFavorito) {
            const newLikedBeers = [...this.state.likedBeers, this.props.beer.id];
            localStorage.setItem('likedBeers', JSON.stringify(newLikedBeers));
        } else {
            const indexOfUnlike = this.state.likedBeers.indexOf(this.props.beer.id);
            const likedBeers = [...this.state.likedBeers];
            likedBeers.splice(indexOfUnlike, 1);
            localStorage.setItem('likedBeers', JSON.stringify(likedBeers));
        }
        this._updateLiked();

    }
    _updateLiked() {
        const likedBeers = JSON.parse(localStorage.getItem('likedBeers')) || [];
        this.setState({
            likedBeers,
            isFavorito: this.props.beer ? likedBeers.includes(this.props.beer.id) : false,
            iconPrefix: !this.state.isFavorito ? 'fas' : 'far'
        });
    }
    render() {
        console.log(this.props);
        if(!this.props.beer) {
            return createPortal((
                <div className="modal is-active single-beer-container">
                <div className="modal-background" onClick={(e) => { e.preventDefault(); this.props.history.push('/') }}/>
                <div className="modal-card">
                    <section className="modal-card-body">
                        {/* <!-- Content ... --> */}
                        <Loader type="circle" />
                    </section>
                </div>
            </div>
        ), document.querySelector('#root'));
        }
        return createPortal((
            <div className="modal is-active single-beer-container">
                <div className="modal-background" onClick={(e) => { e.stopPropagation(); this.props.history.push('/'); }}></div>
                <div className="modal-card">
                    <section className="modal-card-body">
                    {/* <!-- Content ... --> */}
                    <div className="beer-info-grid">
                        <div className="picked-beer-info">
                            <div className="image beer-image">
                                <img src={this.props.beer.image_url} alt="" />
                            </div>
                        </div>
                        <div className="beer-info" style={{  }}>
                            <section class="hero">
                                <div class="hero-body section beer-info-name">
                                    <div class="container" style={{ width: 'auto' }}>
                                        <h1 class="title">
                                            {this.props.beer.name}
                                        </h1>
                                        <h2 class="subtitle">
                                            {this.props.beer.tagline}
                                        </h2>
                                        <div className="underline-name"></div>
                                    </div>
                                </div>
                            </section>
                            <div className="beer-details-container section no-padding-vertical">
                                <span className="beer-details"><b>IBU:</b> {this.props.beer.ibu}</span>
                                <span className="beer-details"><b>ABV:</b> {this.props.beer.abv}</span>
                                <span className="beer-details"><b>EBC:</b> {this.props.beer.ebc}</span>
                                <span aria-label={this.state.isFavorito ? '' : 'Did you like this beer?'} data-microtip-position="top" role={this.state.isFavorito ? '' : 'tooltip'} onClick={this.handleLikedBeer} class={this.state.isFavorito ? "icon is-medium like-heart is-red" : "icon is-medium like-heart"}>
                                    <FontAwesomeIcon icon={[this.state.iconPrefix, 'heart']} />
                                </span>
                            </div>
                            <section className="section">
                                <p>{this.props.beer.description}</p>
                            </section>
                            <section className="section eat-with">
                                <p>Best served with:</p>
                                <ul>{this.props.beer.food_pairing.map(food => <li key={`${this.props.beer.name}_${this.props.beer.id}_${food}`}>{food}</li>)}</ul>
                            </section>


                        </div>
                        <div className="beer-suggestions" style={{  }}/>
                    </div>
                    </section>
                </div>
            </div>
        ), document.querySelector('#root'));
    }
}
export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(BeerModal);