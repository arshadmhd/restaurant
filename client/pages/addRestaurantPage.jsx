import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {notify} from 'react-notify-toast';
import {Field, reduxForm} from 'redux-form';
import {validate_restaurant as validate} from './../common/forms/validation';
import {renderTextField} from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axiosInstance from '../client';
import {CREATE_RESTAURANT_ENDPOINT, UPDATE_RESTAURANT_ENDPOINT} from "../endpoints";
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import {clearRestaurantData, fetchRestaurantAction} from "../actions";
import {connect} from "react-redux";
import {Gen} from "../helpers/gen";

class AddRestaurantPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
            initialized: false,
        };
    }

    getPageType() {
        const id = this.props.match.params.id || null;
        return id ? "Edit" : "Create";
    }

    componentWillMount() {
        const id = this.props.match.params.id || null;
        if(id) {
            this.props.fetchRestaurantAction(id);
        } else {
            this.props.clearRestaurantData();
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
        let {name, address} = data;

        const id = this.props.match.params.id || null;
        const endpoint = this.getPageType() === "Edit" ? UPDATE_RESTAURANT_ENDPOINT + "/" + id : CREATE_RESTAURANT_ENDPOINT;

        const postData = {id, name, address};

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
          <title>{`Add/Edit Restaurant`}</title>
        </Helmet>
    );
  }

    render() {

      const { handleSubmit, restaurantData } = this.props;
      const pageType = this.getPageType();

      if((pageType === 'Edit' && !restaurantData)) {
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
                                    <Link className="proceed-to-link" to="/">Proceed to restaurants page</Link>

                                </div>: <form className="add-restaurant-container" onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">

                                        <div className="form_row">
                                            <Field
                                                name="name"
                                                component={renderTextField}
                                                label="Name:"
                                                placeholder="Name"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="address"
                                                component={renderTextField}
                                                label="Address:"
                                                placeholder="Address"
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
                                                {pageType} restaurant
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
        restaurantData: Object.assign({}, {...state.restaurant}),
        initialValues: Object.assign({}, {...state.restaurant}),
    };
}

AddRestaurantPage = reduxForm({
      form: 'restaurantForm',
      validate,
      enableReinitialize: true,
})(AddRestaurantPage);

export default {
    component: connect(mapStateToProps, { fetchRestaurantAction, clearRestaurantData })(AddRestaurantPage)
};
