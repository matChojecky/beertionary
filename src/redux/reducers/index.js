import { FETCHED_EVERY_BEER, FETCHING_BEERS, FETCHED_BEERS, CHANGE_ONLY_LIKED_FILTER, UPDATE_SEARCH_VALUE } from '../../constants/action-types';

const initialState = {
    beerData: [],
    pagesFetched: 0,
    isFetching: false,
    canFetch: true,
    filterOnlyLiked: false,
    searchByName: ''
};

const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCHING_BEERS:
            return {...state, isFetching: true };
        case FETCHED_BEERS:
            const newBeerData = [...state.beerData, ...action.payload];
            return { ...state, beerData: newBeerData, isFetching: false, pagesFetched: state.pagesFetched + 1};
        case FETCHED_EVERY_BEER:
            const canFetch = state.beerData.length ? false : true;
            return { ...state, canFetch, isFetching: false };
        case CHANGE_ONLY_LIKED_FILTER:
            return { ...state, filterOnlyLiked: action.payload };
        case UPDATE_SEARCH_VALUE:
            return { ...state, searchByName: action.payload };
        default: 
            return state
    }
}

export default rootReducer;