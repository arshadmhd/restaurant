import {
    GET_RESTAURANT_ENDPOINT,
    GET_RESTAURANTS_ENDPOINT,
    SIGN_UP_ENDPOINT_POST,
    GET_USER_DETAILS,
    LOGOUT_USER,
    GET_OTHER_USER_DETAILS,
    GET_USERS_ENDPOINT,
    GET_REVIEW_ENDPOINT,
    GET_REVIEWS_ENDPOINT,
    GET_REVIEWS_UNREPLIED_ENDPOINT
} from './endpoints';
import {actions} from './constants';

export const fetchOtherUserDetails = (id) => async (dispatch, getState, api) => {

    await api.get(GET_OTHER_USER_DETAILS + "/" + id).then(response => {
        console.log(response)
        dispatch({
            type: actions.FETCH_OTHER_USER_DATA,
            payload: response.data
        })
    }).catch((err) => {
        console.log(err);
        console.log('error', err.response.data.error.message);
    })
};

export const fetchUserDetails = () => async (dispatch, getState, api) => {

    await api.get(GET_USER_DETAILS).then(response => {
        console.log(response)
        dispatch({
            type: actions.FETCH_USER_DATA,
            payload: response.data
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const clearUserDetails = () => async (dispatch, getState, api) => {

    await api.post(LOGOUT_USER, {}).then(response => {
        console.log(response)
        dispatch({
            type: actions.CLEAR_USER_DATA,
            payload: response.data
        })
    }).catch((err) => {
        console.log(err);
        console.log('error', err.response.data.error.message);
    })

};

export const fetchReviewAction = (resId, reviewID) => async (dispatch, getState, api) => {

    await api.get(GET_REVIEW_ENDPOINT+`/${resId}/${reviewID}`).then(response => {
        console.log(response);
        dispatch({
            type: 'FETCH_REVIEW',
            payload: response.data.success.data
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const fetchRestaurantAction = (productID) => async (dispatch, getState, api) => {

    await api.get(GET_RESTAURANT_ENDPOINT+'/'+productID).then(response => {
        console.log(response)
        dispatch({
            type: 'FETCH_RESTAURANT',
            payload: response.data.success.data
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};


export const fetchReviewsAction = (resId) => async (dispatch, getState, api) => {

    const url = resId ? GET_REVIEW_ENDPOINT + '/' + resId : GET_REVIEWS_UNREPLIED_ENDPOINT;
    await api.get(url).then(response => {
        console.log(response);
        dispatch({
            type: 'FETCH_REVIEWS',
            payload: response.data.success.data
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const fetchUsersAction = (data) => async (dispatch, getState, api) => {

    const state = getState();
    const nextUrl = state.users.nextUrl || null;

    const endpoint = nextUrl ? nextUrl : GET_USERS_ENDPOINT;

    const merge = nextUrl ? true : false;

    await api.get(endpoint).then(response => {
        dispatch({
            type: 'FETCH_USERS',
            payload: response.data,
            merge: merge
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })
};

export const fetchRestaurantsAction = (data) => async (dispatch, getState, api) => {

    const state = getState();
    const nextUrl = state.restaurants.nextUrl || null;
    const order = data.order || 'desc';

    const endpoint = nextUrl ? nextUrl : GET_RESTAURANTS_ENDPOINT + "?order=" + order;

    const merge = nextUrl ? true : false;

    await api.post(endpoint, data).then(response => {
        dispatch({
            type: 'FETCH_RESTAURANTS',
            payload: response.data,
            merge: merge
        })
    }).catch((err) => {
        console.log('error', err.response.data.error.message);
    })

};

export const clearRestaurantData = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_PROPERTY_DATA'
    })
};


export const clearReviewData = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_REVIEW_DATA'
    })
};

export const clearNextUrl = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_NEXT_URL'
    })
};


export const clearUsersNextUrl = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_USERS_NEXT_URL'
    })
};
