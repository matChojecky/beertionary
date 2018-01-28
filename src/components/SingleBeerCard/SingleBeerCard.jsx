import React, { Component } from 'react';
import './SingleBeerCard.scss';

import { withRouter } from 'react-router-dom';

import Loader from '../Loader/Loader';

class SingleBeerCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgLoading: true
        };
        this.beer_image = new Image();
        this.beer_image.classList.add('beer-image');
        this.imageLoaded = this.imageLoaded.bind(this);
    }
    componentWillMount() {
        this.beer_image.src = this.props.beer.image_url;
    }

    componentDidMount() {
        this.beer_image.addEventListener('load', this.imageLoaded);
        this._mounted = true;
    }
    componentWillUnmount() {
        this.beer_image.removeEventListener('load', this.imageLoaded);
        this._mounted = false;
    }


    imageLoaded(event) {
        const timeout = setTimeout(() => {
            if(this.imgCont) {
                this.imgCont.appendChild(this.beer_image);
            }
            if(this._mounted) {
                this.setState({ imgLoading: false });
            }

            clearTimeout(timeout);
        }, 250)
    }

    render() {
        return (
            <div className="beer-card-container column is-one-quarter-desktop is-one-third-tablet" onClick={() => { this.props.history.push(`/beer/${this.props.beer.id}`) }}>
                <div className="card beer-card">
                    {!this.imgCont}
                    <div className="card-content card-flex-center" ref={(_imgContainer) => { this.imgCont = _imgContainer; }}>
                    {this.state.imgLoading ? (
                        <Loader />
                    ) : null}
                    </div>
                    <footer>
                        <p className="title is-5 beer-name-on-single-card">{this.props.beer.name}</p>
                        <p className="subtitle">{this.props.beer.tagline}</p>
                    </footer>
                </div>
            </div>
        );
    }
}
export default withRouter(SingleBeerCard);