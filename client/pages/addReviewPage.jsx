import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {notify} from 'react-notify-toast';
import {Field, reduxForm} from 'redux-form';
import {validate_review as validate} from './../common/forms/validation';
import {renderDateTimePicker, renderTextField} from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axiosInstance from '../client';
import {CREATE_REVIEW_ENDPOINT, UPDATE_REVIEW_ENDPOINT} from "../endpoints";
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import {clearReviewData, fetchRestaurantAction, fetchReviewAction} from "../actions";
import {connect} from "react-redux";
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {Gen} from "../helpers/gen";
import RatingComponent from "../components/ratingComponent";

class AddReviewPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
            initialized: false,
        };
    }

    isOwner() {
        return this.props.restaurantData && this.props.user && (this.props.restaurantData.userId === this.props.user.id);
    }

    isAdmin() {
        return this.props.user && this.props.user.role === 'ADMIN';
    }

    getPageType() {
        const id = this.props.match.params.id || null;
        return id ? "Edit" : "Create";
    }

    componentWillMount() {
        const id = this.props.match.params.id || null;
        const resId = this.props.match.params.resId || null;
        if(id) {
            this.props.fetchRestaurantAction(resId);
            this.props.fetchReviewAction(resId, id);
        } else {
            this.props.clearReviewData();
        }
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
            initialized: this.state.initialized,
        });
    }

    submit(data){
        this.toggle();
        console.log(data);
        let {date, comment} = data;

        const id = this.props.match.params.id || null;
        const resId = this.props.match.params.resId;
        if(!resId) {
            alert("no res id");
        }
        const endpoint = this.getPageType() === "Edit" ? UPDATE_REVIEW_ENDPOINT + "/" + resId + "/" + id : CREATE_REVIEW_ENDPOINT + "/" + resId;

        const postData = {id, comment, dateOfVisit: this.state.date || this.props.reviewData.dateOfVisit, rating: this.state.rating || this.props.reviewData.rating};

        if(this.getPageType() === "Edit") {
            axiosInstance.put(endpoint, postData)
                .then((success) => {
                    console.log(success.data.success.message);
                    notify.show(success.data.success.message, 'success');
                    this.setState({
                        loading: false,
                        showForm: false,
                    })
                })
                .finally(() => {
                    this.toggle();
                });
        } else {
            axiosInstance.post(endpoint, postData)
                .then((success) => {
                    console.log(success.data.success.message);
                    notify.show(success.data.success.message, 'success');
                    this.setState({
                        loading: false,
                        showForm: false,
                    })
                })
                .finally(() => {
                    this.toggle();
                });
        }
  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`Add/Edit Review`}</title>
        </Helmet>
    );
  }

  onChange(rating) {
      this.setState({
          rating: rating
      });
  }

    onDateChange(date) {
            this.setState({
                date: date
            });
    }

    render() {

      const isAdmin = this.isAdmin();
      const isOwner = this.isOwner();
      const { handleSubmit, reviewData}  = this.props;
      let rating = reviewData && reviewData.rating;
      rating = this.state.rating || rating || 0;
      const pageType = this.getPageType();
      let date = reviewData && reviewData.dateOfVisit ? new Date(reviewData.dateOfVisit) : null;
      date = this.state.date || date;
      if((pageType === 'Edit' && !reviewData)) {
          return null;
      }

      return (
          <section className="contactPage_wrap">
          {this.head()}
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">
                            {
                                !this.state.showForm ? <div className="confirm_email_block">
                                    <div className="confirm_email_check">
                                        Resource created/updated successfully
                                    </div>
                                    <Link className="proceed-to-link" to="/">Proceed to home page</Link>

                                </div>: <form className="add-review-container" onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">

                                        <div className="form_row">
                                            <RatingComponent initialRating={rating} onChange={this.onChange.bind(this)} readOnly={!(isAdmin || this.getPageType()==='Create')}/>
                                        </div>

                                        <div className="form_row">
                                            <DateTimePicker
                                                max={new Date()}
                                                selected={date}
                                                defaultValue={date}
                                                placeholder={date && date.toDateString()}
                                                time={false}
                                                onChange={this.onDateChange.bind(this)}
                                                disabled={!(isAdmin || this.getPageType()==='Create')}
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="comment"
                                                component={renderTextField}
                                                label="Comment:"
                                                placeholder="Comment"
                                                disabled={!(isAdmin || this.getPageType()==='Create')}
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="reply"
                                                component={renderTextField}
                                                label="Reply:"
                                                placeholder="Reply"
                                                disabled={!(isAdmin || this.getPageType()==='Create' || isOwner)}
                                                // TODO:This check means that owner can further edit
                                            />
                                        </div>

                                        <div className="form_buttons">
                                            <LaddaButton
                                                type="submit"
                                                className="btn btn-add first"
                                                loading={this.state.loading}
                                                data-color="#eee"
                                                data-size={XL}
                                                data-style={SLIDE_UP}
                                                data-spinner-size={30}
                                                data-spinner-color="#ddd"
                                                data-spinner-lines={12}
                                            >
                                                {pageType} review
                                            </LaddaButton>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                      </div>
                  </div>
              </div>
              </ReactCSSTransitionGroup>
          </section>
      );
    }
  }

function mapStateToProps(state){
    return {
        reviewData: Object.assign({}, {...state.review}, {date: state.review && state.review.dateOfVisit && new Date(state.review && state.review.dateOfVisit)}),
        initialValues: Object.assign({}, {...state.review}, {date: state.review && state.review.dateOfVisit && new Date(state.review && state.review.dateOfVisit)}),
        user: state.user,
        restaurantData: state.restaurant,
    };
}

AddReviewPage = reduxForm({
      form: 'reviewForm',
      validate,
      enableReinitialize: true,
})(AddReviewPage);

export default {
    component: connect(mapStateToProps, { fetchRestaurantAction, fetchReviewAction, clearReviewData })(AddReviewPage)
};
