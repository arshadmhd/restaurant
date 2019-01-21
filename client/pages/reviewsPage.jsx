import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Row} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from '../components/banners/internalTextBanner';
import {fetchReviewsAction} from '../actions';
import {Helmet} from 'react-helmet';
import _ from 'underscore';
import ReviewComponent from "../components/reviewComponent";
import {Gen} from "../helpers/gen";

class Reviews extends Component {

    componentDidMount(){
        const resId = this.props.match.params.resId;
        this.props.fetchReviewsAction(resId);
    }

    renderReviews() {
        const reviewsData = this.props.reviews.map((review, index) => {
            return (
                <div key={index} className="reviews-box-container">
                    <ReviewComponent fetchRestaurantAction={() =>{}} isOwner={true} isAdmin={Gen.isUserAdmin(this.props.user)} review={review}/>
                </div>
            );
        });
        return (<div>
                {reviewsData}
            </div>
        );
    }

    head(){
        return (
            <Helmet bodyAttributes={{class: "postsPage"}}>
                <title>{`Reviews Page`}</title>
            </Helmet>
        );
    }

    render() {
        const {reviews} = this.props;
        const userId = this.props.match.params.id;
        if(reviews){
            return(
                <div className="restaurants-page">
                    {this.head()}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <Grid className="restaurants">
                            <Row>
                                {
                                    (reviews.length > 0) ? this.renderReviews()
                                        :
                                        <div className="no-result">
                                            <h2> No reviews for you to reply</h2>
                                        </div>
                                }
                            </Row>
                        </Grid>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div>
                    {this.head()}
                    <InternalTextBanner Heading="" wrapperClass="posts" />
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                        <div className="main anim-appear">
                            <div className="grid">
                                <div className="column column_8_12">
                                    <div className="posts">

                                    </div>
                                </div>
                                <div className="column column_4_12">

                                </div>
                            </div>
                        </div>
                    </ReactCSSTransitionGroup>
                </div>);
        }
  }
}

function mapStateToProps(state){
    return {
        reviews: state.reviews,
        user: state.user,
    };
}

export default {
    component: connect(mapStateToProps, { fetchReviewsAction, })(Reviews)
};

