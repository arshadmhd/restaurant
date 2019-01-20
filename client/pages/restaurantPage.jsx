import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Helmet} from 'react-helmet';
import InfoBlock from '../components/infoBlock';
import {clearRestaurantData, fetchRestaurantAction} from "../actions";
import {Col, Grid, Row} from 'react-bootstrap';
import _ from 'underscore';
import axiosInstance from '../client';
import {Gen} from "../helpers/gen";
import {Link, withRouter} from "react-router-dom";
import {DELETE_RESTAURANT_ENDPOINT} from "../endpoints";
import {notify} from "react-notify-toast";
import RatingComponent from "../components/ratingComponent";
import ReviewComponent from "../components/reviewComponent";

class Restaurant extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: ''
        }
    }
    componentDidMount(){
        console.log(this.props);
        this.props.fetchRestaurantAction(this.props.match.params.id);
    }
    componentWillUnmount(){
        this.props.clearRestaurantData();
    }
    deleteRestaurant() {
        axiosInstance.delete(DELETE_RESTAURANT_ENDPOINT + "/" + this.props.match.params.id)
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.props.history.push(`/restaurants`);
            })
    }

    isOwner() {
        return (this.props.restaurantData.userId === this.props.user.id);
    }

    isAdmin() {
        return this.props.user.role === 'ADMIN';
    }

    render() {
        if(this.props.restaurantData){
            const isOwner = this.isOwner();
            const isAdmin = this.isAdmin();
            const {id, name, userId, address, rating, createdAt, updatedAt, reviews : {lowest, highest, last, userReview}} = this.props.restaurantData;
            const {currentTime} = this.state;
            return(
                <div className="restaurant-page">
                    {/*<InternalTextBanner Heading={this.props.restaurantData.title} wrapperClass="post" />*/}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="post">
                                    <Grid>
                                        <Row className="title-row">
                                            {
                                                isOwner || isAdmin ?
                                                <div><Link className="right-align" to={`/restaurant/edit/${id}`}>Edit this restaurant</Link>
                                                    <div className="delete-restaurant" onClick={this.deleteRestaurant.bind(this)}>
                                                        Delete
                                                    </div>
                                                </div> : ''
                                            }
                                        </Row>
                                        <Row className="bottom-line-separator">
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <Link to={`/user/${userId}`} >See User Profile </Link>
                                                    </Col>

                                                </Row>

                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="Name" info={name} />
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="Address" info={address} />
                                                    </Col>
                                                    <Col xs={6}>
                                                        <InfoBlock heading="Created At" info={Gen.getDateFromISODate(createdAt)}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6} >
                                                    </Col>

                                                    <Col xs={6} >
                                                    </Col>
                                                </Row>

                                                <InfoBlock heading="Rating" info={`${rating}`} isBig={true} />

                                            </Col>

                                            <RatingComponent onChange={() => {}} initialRating={rating} readOnly={true} />
                                            <Col sm={12} md={6}>
                                                <img alt="restaurant icon" className="restaurant-image-page" src={'/assets/graphics/restauranticon.png'} />
                                            </Col>
                                        </Row>
                                    </Grid>
                                    {
                                        !_.isEmpty(userReview) ?
                                            <ReviewComponent fetchRestaurantAction={this.props.fetchRestaurantAction} review={userReview} type={'your review'} isOwner={isOwner} isAdmin={isAdmin} />
                                            : (isAdmin || isOwner) ? '' : <div><Link className="" to={`/review/${id}/add`}>Add review</Link></div>
                                    }

                                    <ReviewComponent fetchRestaurantAction={this.props.fetchRestaurantAction} review={last} type={'latest'} isOwner={isOwner} isAdmin={isAdmin} />
                                    <ReviewComponent fetchRestaurantAction={this.props.fetchRestaurantAction} review={highest} type={'highest'} isOwner={isOwner} isAdmin={isAdmin} />
                                    <ReviewComponent fetchRestaurantAction={this.props.fetchRestaurantAction} review={lowest} type={'lowest'} isOwner={isOwner} isAdmin={isAdmin} />
                                </div>
                            </div>
                        </div>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div className="restaurant-page">
                    <Helmet bodyAttributes={{class: "postPage"}}>
                        <title>{'Restaurant Page'}</title>
                    </Helmet>
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="post">

                                </div>
                            </div>
                        </div>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        }
    }
  }

function mapStateToProps(state){
    return {
        restaurantData: state.restaurant,
        user: state.user,
    };
}
function loadData(store, landingPageID){
    return store.dispatch(fetchRestaurantAction(landingPageID));
}

export default {
    loadData,
    component: withRouter(connect(mapStateToProps, { fetchRestaurantAction, clearRestaurantData })(Restaurant))
};

