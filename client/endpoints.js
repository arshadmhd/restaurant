const config = require('../webConfig.json');

export const GET_REVIEW_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/review';
export const GET_REVIEWS_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/review/unreplied';
export const CREATE_REVIEW_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/review';
export const UPDATE_REVIEW_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/review';
export const DELETE_REVIEW_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/review';
export const GET_RESTAURANT_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/restaurant';
export const GET_RESTAURANTS_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/restaurant/search';
export const CREATE_RESTAURANT_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/restaurant';
export const UPDATE_RESTAURANT_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/restaurant';
export const DELETE_RESTAURANT_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/restaurant';
export const SIGN_UP_ENDPOINT_POST = config.axiosInstance_baseURL+'/api/v1/user/signup';
export const LOG_IN_ENDPOINT_POST = config.axiosInstance_baseURL+'/api/v1/user/login';
export const UPDATE_USER_ENDPOINT_PUT = config.axiosInstance_baseURL+'/api/v1/user';
export const DELETE_USER_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/user';
export const GET_USER_DETAILS = config.axiosInstance_baseURL+'/api/v1/user/details';
export const GET_USERS_ENDPOINT = config.axiosInstance_baseURL+'/api/v1/user';
export const GET_OTHER_USER_DETAILS = config.axiosInstance_baseURL+'/api/v1/user';
export const RESEND_EMAIL = config.axiosInstance_baseURL+'/api/v1/user/email_confirmation';
export const PASSWORD_RESET = config.axiosInstance_baseURL+'/api/v1/user/password_reset';
export const LOGOUT_USER = config.axiosInstance_baseURL+'/api/v1/user/logout';


