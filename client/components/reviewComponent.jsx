import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RatingComponent from "./ratingComponent";
import InfoBlock from "./infoBlock";
import {Gen} from "../helpers/gen";
import {Link} from "react-router-dom";
import _ from 'underscore';
import axiosInstance from "../client";
import { DELETE_REVIEW_ENDPOINT} from "../endpoints";
import {notify} from "react-notify-toast";

class ReviewComponent extends Component {

    deleteReview() {
        const {id,restaurantId} = this.props.review;
        axiosInstance.delete(`${DELETE_REVIEW_ENDPOINT}/${restaurantId}/${id}`)
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.props.fetchRestaurantAction(restaurantId);
            })
    }
    render(){
        const {isAdmin, isOwner} = this.props;
        if(_.isEmpty(this.props.review))
            return null;
        let {id, comment, rating, dateOfVisit, createdAt, updatedAt, reply, restaurantId, userId} = this.props.review;
        const canEdit = false; // check if the userId is same as current user id
        return (<div className='review-container card'>
            <div className='card-body container'>
                <InfoBlock heading='' info={this.props.type} isBig={true} />
                <RatingComponent onChange={this.onChange} readOnly={!canEdit} initialRating={rating}/>
                <InfoBlock heading="Rating" info={rating} />

                <InfoBlock heading="Visiting date" info={Gen.getDateFromISODate(dateOfVisit)} />
                <InfoBlock heading="Comment" info={comment} />
                <InfoBlock heading="Reply" info={reply} />

                <div className='margin-top-20'>

                    {
                        isAdmin ?  <div className="delete-review" onClick={this.deleteReview.bind(this)}>
                            Delete
                        </div> : ''
                    }

                    {
                        isAdmin ?
                        <Link className="" to={`/review/${restaurantId}/edit/${id}`}>
                            Edit this review
                        </Link> : isOwner && !reply ? <Link className="" to={`/review/${restaurantId}/edit/${id}`}>
                                Reply
                            </Link> : ''
                    }
                </div>
            </div>
        </div>)
    };
}

ReviewComponent.proptypes = {
    review: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    fetchRestaurantAction: PropTypes.func.isRequired,
};

export default ReviewComponent;
