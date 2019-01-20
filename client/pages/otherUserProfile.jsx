import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';
import LaddaButton, {SLIDE_UP, XL} from 'react-ladda';
import {notify} from 'react-notify-toast';
import {validate_registerForm as validate} from './../common/forms/validation';
import {renderTextField} from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';
import {appName} from '../constants';
import axiosInstance from '../client';
import {DELETE_USER_ENDPOINT, UPDATE_USER_ENDPOINT_PUT} from "../endpoints";
import {renderDropdownList} from "../common/forms/input-types/index";
import {Gen} from "../helpers/gen";
import {fetchOtherUserDetails, fetchUserDetails} from "../actions";

class OtherUserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showForm: true,
        };
    }

    componentWillMount() {
        const id = this.props.match.params.id || null;
        if (id) {
            this.props.fetchOtherUserDetails(id);
        }
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
        });
    }

    logout(e) {
        e.preventDefault();
        this.props.clearUserDetails();
    }


    delete(e) {
        const id = this.props.match.params.id
        if (e)
            e.preventDefault();
        axiosInstance.delete(DELETE_USER_ENDPOINT + '/' + id, {})
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.setState({
                    showForm: false
                });
                window.location.href = "/";
            })
            .catch((error) => {
                this.setState({
                    showForm: true
                });
            })
            .finally(() => {
                this.setState({
                    loading: false
                })
            });
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
                })
            })
            .finally(() => {
                this.setState({
                    loading: false
                })
            });
    }

    head() {
        return (
            <Helmet bodyAttributes={{class: "contactPage"}}>
                <title>{`Other User Profile - ${appName}`}</title>
            </Helmet>
        );
    }

    render() {
        const {handleSubmit, currentUser, user} = this.props;
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
                                            <Link className="right-align"
                                                  to={`/restaurants/${this.props.match.params.id}`}> User's
                                                Restaurants </Link>
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
                                                Gen.isUserAdmin(currentUser) ?
                                                    <div className="form_row">
                                                        <Field
                                                            name="role"
                                                            component={renderDropdownList}
                                                            label="User Type:"
                                                            data={['ADMIN', 'MANAGER', 'USER']}/>
                                                    </div> : ''
                                            }

                                            <div className="form_row">
                                                <Field
                                                    name="status"
                                                    component={renderDropdownList}
                                                    label="Status:"
                                                    data={ Gen.isUserAdmin(currentUser) ? ['active', 'inactive']: user ? [user.status] : [] }/>
                                            </div>

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

                                            <Link className="logout-link" to="/" onClick={this.delete.bind(this)}>Delete
                                                Account</Link>

                                            <p>Note: deleting account will delete all your data including restaurants that
                                                you created.</p>
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


OtherUserProfile = reduxForm({
    form: 'otherUserProfileForm',
    validate,
    enableReinitialize: true,
})(OtherUserProfile);


function mapStateToProps(state) {
    return {
        user: state.otherUser,
        initialValues: state.otherUser,
        currentUser: state.user,
    };
}

export default {
    component: connect(mapStateToProps, {fetchOtherUserDetails})(OtherUserProfile)
};
