import React from 'react';
import avatar from '../../assets/fetchinAvatar.png'
import avatarFetched from '../../assets/fetchingAvatarNoMoreBeer.png';

import './FetchingAvatar.scss';


const FetchingAvatar = ({ ...props }) => {
    let containerClasses = '';
    if(!props.isFetching && !props.canFetch) {
        containerClasses = 'fetching-avatar-container avatar-is-hidden-slow';
    } else if (props.isFetching) {
        containerClasses = 'fetching-avatar-container';
    } else {
        containerClasses = 'fetching-avatar-container avatar-is-hidden';
    }
    return (
    <div className={containerClasses}>
        {props.canFetch ? (
            <img src={avatar} alt="This is fetching avatar" />
        ) : (

            <img src={avatarFetched} alt=""/>
        )}
    </div>
)};

export default FetchingAvatar;