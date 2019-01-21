import React from 'react';
import App from './app';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import Restaurant from './pages/restaurantPage';
import AddReview from './pages/addReviewPage';
import ReviewsPage from './pages/reviewsPage';
import AddRestaurant from './pages/addRestaurantPage';
import Restaurants from './pages/restaurantsPage';
import Users from './pages/usersPage';
import UserProfile from './pages/userProfile';
import OtherUserProfile from './pages/otherUserProfile';
import TermsAndConditions from './pages/policies/termsAndConditions';
import Privacy from './pages/policies/privacy';
import CookiesPolicy from './pages/policies/cookiesPolicy';
import NotFoundPage from './pages/notFound404Page';

export default [
    {
        path: '/restaurant',
        ...App,
        routes: [
            {
                path: '/restaurant/add',
                ...AddRestaurant
            },
            {
                path: '/restaurant/edit/:id',
                ...AddRestaurant
            },
            {
                path: '/restaurant/:id',
                ...Restaurant
            }
        ]
    },
    {
        path: '/review',
        ...App,
        routes: [
            {
                path: '/review/:resId/add',
                ...AddReview
            },
            {
                path: '/review/:resId/edit/:id',
                ...AddReview
            },
        ]
    },
    {
        path: '/reviews',
        ...App,
        routes: [
            {
                path: '/reviews/pending',
                ...ReviewsPage
            },
            {
                path: '/reviews/:resId',
                ...ReviewsPage
            }
        ]
    },
    {
        path: '/restaurants',
        ...App,
        routes: [
            {
            path: '/restaurants/:id',
            ...Restaurants
            },
            {
                path: '/restaurants',
                ...Restaurants
            }
        ]
    },
    {
        path: '/register',
        ...App,
        routes: [
            {
                ...RegisterPage
            }
        ]
    },
    {
        path: '/user',
        ...App,
        routes: [
            {
                path: '/user/profile',
                ...UserProfile
            },
            {
                path: '/user/:id',
                ...OtherUserProfile
            }
        ]
    },
    {
        path: '/users',
        ...App,
        routes: [
            {
                path: '/users',
                ...Users
            }
        ]
    },
    {
        path: '/login',
        ...App,
        routes: [
            {
                ...LoginPage
            }
        ]
    },
    {
        path: '/reset-password',
        ...App,
        routes: [
            {
                ...ResetPasswordPage
            }
        ]
    },
    {
        path: '/policies/terms',
        ...App,
        routes: [
            {
                ...TermsAndConditions
            }
        ]
    },
    {
        path: '/policies/privacy',
        ...App,
        routes: [
            {
                ...Privacy
            }
        ]
    },
    {
        path: '/policies/cookies',
        ...App,
        routes: [
            {
                ...CookiesPolicy
            }
        ]
    },
    {
        path: '/',
        exact: true,
        ...App,
        routes: [
            {
                ...Restaurants
            }
        ]
    },
    {
        path: '/',
        ...App,
        routes: [
            {
                ...NotFoundPage
            }
        ]
    }
];

