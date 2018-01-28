import React, { Component } from 'react';
import { connect } from "react-redux";

import SingleBeerCard from '../SingleBeerCard/SingleBeerCard.jsx';
import { fetchNextPage } from '../../redux/actions/index';

import FetchingAvatar from "../FetchingAvatar/FetchingAvatar";
import Loader from '../Loader/Loader';

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;
  
      var now = +new Date(),
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

const likedBeers = JSON.parse(localStorage.getItem('likedBeers'));
const mapStateToProps = state => {
    return { beerData: state.beerData.filter(beer => beer.name.toLowerCase().includes(state.searchByName.toLowerCase())).filter(beer => !state.filterOnlyLiked || likedBeers.includes(beer.id)), isFetching: state.isFetching, canFetch: state.canFetch }
};
const mapDispatchToProps = dispatch => {
    return {
    fetchNextPage: () => { dispatch(fetchNextPage()) }
    };
};

class BeerList extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = throttle(this.handleScroll.bind(this), 500, this);
    }

    componentDidMount() {
        // console.log(this.props);
        this.props.fetchNextPage();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    componentDidUpdate() {
        if(this.props.filterOnlyLiked && !this.props.isFetching) {
            const timeout = setTimeout(() => {
                if(this.props.filterOnlyLiked && !this.props.isFetching) {
                    this.props.fetchNextPage();
                }
                clearTimeout(timeout);
            }, 2500);
        }
    }
    handleScroll(event) {
        if(document.body.scrollHeight - (window.innerHeight + window.pageYOffset) < 250 && !this.props.isFetching) {
            this.props.fetchNextPage();
        }
    }

    render() {
        const beerCards = this.props.beerData.map(beer => <SingleBeerCard key={`${beer.id}_${beer.name.trim()}`} beer={beer} />)
        return [(
            <section className="section" onScroll={this.handleScroll}>
                <div className="container">
                    <div className="columns is-multiline is-8">
                        {beerCards}
                    </div>
                </div>
                {this.props.isFetching ? <Loader type="circle" /> : null}
            </section>
        ), <FetchingAvatar isFetching={this.props.isFetching} canFetch={this.props.canFetch} />];
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BeerList);