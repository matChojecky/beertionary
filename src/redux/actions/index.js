import { FETCHED_EVERY_BEER, FETCHING_BEERS, FETCHED_BEERS, CHANGE_ONLY_LIKED_FILTER, UPDATE_SEARCH_VALUE } from '../../constants/action-types';

export function fetchNextPage() {
    return (dispatch, getState) => {
        if(!getState().canFetch) {
            return dispatch(everyBeerFetched());
        }
        dispatch(fetchingBeers());
        fetch(`https://api.punkapi.com/v2/beers?page=${getState().pagesFetched + 1}&per_page=20`)
        .then(res => res.json())
        .then((data) => {
            if(data.length) {
                dispatch(fetchedNewPage(data));
            } else {
                dispatch(everyBeerFetched());
            }
        })
        .catch(err => console.log(err));
    }
}

export function fetchingBeers() {
    return {type: FETCHING_BEERS, payload: null};
}

export function fetchedNewPage(newBeers) {
    return { type: FETCHED_BEERS, payload: newBeers };
}

export function everyBeerFetched() {
    return { type: FETCHED_EVERY_BEER, payload: null };
}
export function showOnlyLikedBeers(onlyLiked) {
    return { type: CHANGE_ONLY_LIKED_FILTER, payload: onlyLiked}
}
export function searchValueChange(value) {
    return {type: UPDATE_SEARCH_VALUE, payload: value};
}