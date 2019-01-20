import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {Link, withRouter} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';
import LaddaButton, {SLIDE_UP, XL} from 'react-ladda';
import {notify} from 'react-notify-toast';
import {validate_registerForm as validate} from './../common/forms/validation';
import {renderTextField} from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';
import {appName} from '../constants';
import axiosInstance from '../client';

import {UPDATE_USER_ENDPOINT_PUT} from "../endpoints";
import {renderDropdownList} from "../common/forms/input-types/index";
import {Gen} from "../helpers/gen";
import {clearUserDetails} from "../actions";

class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
        };
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
        });
    }

    logout(e) {
        if (e)
            e.preventDefault();
        this.props.clearUserDetails();
        this.props.history.push(`/login`);
    }

    submit(data) {
        this.toggle();
        console.log(data);
        const {id} = this.props.user;

        axiosInstance.put(UPDATE_USER_ENDPOINT_PUT + '/' + id, data)
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.setState({
                    showForm: false
                })
            })
            .catch((error) => {
                this.setState({
                    showForm: true
                });
            })
            .finally(() => {
                this.setState({
                    loading: false
                });
            });

    }

    head() {
        return (
            <Helmet bodyAttributes={{class: "contactPage"}}>
                <title>{`User Profile - ${appName}`}</title>
            </Helmet>
        );
    }

    render() {
        const {handleSubmit, currentUser} = this.props;

        return (

            <section className="contactPage_wrap">
                {this.head()}
                <InternalTextBanner Heading="User Profile" wrapperClass="contact"/>
                <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true} transitionAppearTimeout={5000}
                                         transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="content_block">

                                    <form className="user-profile-container"
                                          onSubmit={handleSubmit(this.submit.bind(this))}>

                                        <div className="form_wrap">

                                            <div className="form_row">
                                                <Field
                                                    name="id"
                                                    readOnly="true"
                                                    component={renderTextField}
                                                    label="ID:"
                                                />
                                            </div>

                                            <div className="form_row">
                                                <Field
                                                    name="name"
                                                    component={renderTextField}
                                                    label="Name:"
                                                />
                                            </div>


                                            <div className="form_row">
                                                <Field
                                                    name="email"
                                                    component={renderTextField}
                                                    label="Email:"
                                                />
                                            </div>

                                            <div className="form_row">
                                                <Field
                                                    name="gender"
                                                    component={renderDropdownList}
                                                    label="Gender:"
                                                    data={['MALE', 'FEMALE', 'OTHER']}/>
                                            </div>

                                            {
                                                Gen.isUserManagerOrAdmin(currentUser) ? '' :
                                                    <div className="form_row">
                                                        <Field
                                                            name="managerId"
                                                            type="number"
                                                            component={renderTextField}
                                                            label="Manager ID:"
                                                        />
                                                    </div>
                                            }

                                            {
                                                Gen.isUserAdmin(currentUser) ? <div className="form_row">
                                                    <Field
                                                        name="status"
                                                        component={renderDropdownList}
                                                        label="Status:"
                                                        data={['active', 'inactive']}/>
                                                </div> : ''
                                            }


                                            <div className="form_buttons">
                                                <LaddaButton
                                                    type="submit"
                                                    className="btn first"
                                                    loading={this.state.loading}
                                                    data-color="#eee"
                                                    data-size={XL}
                                                    data-style={SLIDE_UP}
                                                    data-spinner-size={30}
                                                    data-spinner-color="#ddd"
                                                    data-spinner-lines={12}
                                                >
                                                    Update Profile
                                                </LaddaButton>
                                            </div>

                                            <Link className="logout-link" to="/"
                                                  onClick={this.logout.bind(this)}>Logout</Link>

                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </ReactCSSTransitionGroup>

            </section>

        );
    }
}


UserProfile = reduxForm({
    form: 'userProfileForm',
    validate,
    enableReinitialize: true,
})(UserProfile);


function mapStateToProps(state) {
    return {
        user: state.user,
        initialValues: state.user,
        currentUser: state.user,
    };
};

export default {
    component: withRouter(connect(mapStateToProps, {clearUserDetails})(UserProfile))
};
