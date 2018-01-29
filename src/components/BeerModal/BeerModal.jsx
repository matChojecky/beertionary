import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { connect } from "react-redux";
import { fetchNextPage } from '../../redux/actions/index';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Loader from '../Loader/Loader.jsx';
import './BeerModal.scss';


const mapStateToProps = (state, ownProps) => {
// Double check and Set likedBeers array in localStorage
    if(!localStorage.getItem('likedBeers')) {
        localStorage.setItem('likedBeers', JSON.stringify([]));
    };
    const beerId = parseInt(ownProps.match.params.id, 10);
    const beer = state.beerData.find(beer => beer.id === beerId);
    const suggestedBeersData = state.beerData.filter(entity => {
        if(!beer || beer.id === entity.id) { return false; }
        let similar = (entity.ibu > beer.ibu - 20 && entity.ibu < beer.ibu + 20) && (entity.abv > beer.abv - 2 && entity.abv < beer.abv + 2) && (entity.ebc > beer.ebc - 20 && entity.ebc < beer.ebc + 20);
        return similar;
    });
    return {
        beer,
        canFetch: state.canFetch,
        isFetching: state.isFetching,
        suggestedBeersData,
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
        const isFavorito = props.beer ? likedBeers.includes(props.beer.id) : false;
        this.state = {
            likedBeers,
            isFavorito,
            iconPrefix: isFavorito ? 'fas' : 'far',
            suggestedBeers: [],
            areSuggestionsHidden: true,
        };

        this.handleLikedBeer = this.handleLikedBeer.bind(this);
    }

    componentWillMount() {
        document.body.classList.add('stop-scrolling');
        if(this.props.beer) {
            const isFavorito = this.props.beer ? this.state.likedBeers.includes(this.props.beer.id) : false;
            this.setState({ isFavorito });
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.beer && this.props.beer && newProps.beer.id !== this.props.beer.id) {
            const likedBeers = JSON.parse(localStorage.getItem('likedBeers')) || [];
            const isFavorito = newProps.beer ? likedBeers.includes(newProps.beer.id) : false;
            this.setState({
                likedBeers,
                isFavorito,
                iconPrefix: isFavorito ? 'fas' : 'far',
                areSuggestionsHidden: true,
            });
        }
    }
    componentWillUpdate(nextProps) {
        if(!this.props.beer && nextProps.beer) {
            const isFavorito = nextProps.beer ? this.state.likedBeers.includes(nextProps.beer.id) : false;
            this.setState({ isFavorito, iconPrefix: isFavorito ? 'fas' : 'far' });
        }
        if(!(nextProps.beer || nextProps.isFetching)) {
            this.props.fetchNextPage();
        }
        if(nextProps.suggestedBeersData && nextProps.suggestedBeersData.length < 3 && nextProps.canFetch && !nextProps.isFetching) {
            this.props.fetchNextPage();
        }
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
        const suggestions = [...this.props.suggestedBeersData].splice(0, 3).map(suggestedBeer => (
            <div className="box" style={{ marginBottom: '1.5rem', flex: 1, marginLeft: '10px', marginRight: '10px', cursor: 'pointer' }} onClick={() => { this.props.history.push(`/beer/${suggestedBeer.id}`); this.setState({ areSuggestionsHidden: true }); this._updateLiked(); }}>
                <article className="media" style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <div className="">
                        <figure className="image is-128x128">
                            <img src={suggestedBeer.image_url} alt="Image"  style={{ height: '100%', width: 'auto', marginLeft: 'auto', marginRight: 'auto '}} />
                        </figure>
                    </div>
                    <div className="media-content">
                        <div className="content">
                            <p style={{ textAlign: 'center' }}>
                                <strong>{suggestedBeer.name}</strong>
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        ));
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
                            <section className="hero">
                                <div className="hero-body section beer-info-name">
                                    <div className="container" style={{ width: 'auto' }}>
                                        <h1 className="title">
                                            {this.props.beer.name}
                                        </h1>
                                        <h2 className="subtitle">
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
                                <span aria-label={this.state.isFavorito ? '' : 'Did you like this beer?'} data-microtip-position="top" role={this.state.isFavorito ? '' : 'tooltip'} onClick={this.handleLikedBeer} className={this.state.isFavorito ? "icon is-medium like-heart is-red" : "icon is-medium like-heart"}>
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
                        <div className="beer-suggestions" style={{  }}>
                            {suggestions.length ? (
                                <div className={this.state.areSuggestionsHidden ? 'beer-suggestions-inner are-suggestions-hidden' : 'beer-suggestions-inner'}>
                                    <div className="toogle-suggestions" onClick={() => { this.setState((prevState, props) => ({ areSuggestionsHidden: !prevState.areSuggestionsHidden })) }}>
                                        <span style={{ fontSize: '2rem' }}>
                                            <FontAwesomeIcon icon={this.state.areSuggestionsHidden ? ['fas', 'angle-double-up'] : ['fas', 'angle-double-down']} />
                                        </span>
                                        {this.state.areSuggestionsHidden ? <p className="title is-6 show-suggestions-txt">Show more beers you might like if you find this one delectable</p> : <p className="title is-6 show-suggestions-txt">Hide suggestions</p>}
                                    </div>
                                    <div className={'suggestions-container'}>
                                        <p className="title is-6 small-screen-incentive">More beer you might like if you find this one delectable:</p>
                                        {suggestions}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    </section>
                </div>
            </div>
        ), document.querySelector('#root'));
    }
}
export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BeerModal);