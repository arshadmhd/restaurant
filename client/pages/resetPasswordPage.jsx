import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';
import LaddaButton, {SLIDE_UP, XL} from 'react-ladda';
import {notify} from 'react-notify-toast';
import {validate_resetForm as validate} from './../common/forms/validation';
import {renderTextField} from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';
import {appName} from '../constants';

import axiosInstance from '../client';
import {PASSWORD_RESET} from "../endpoints";

class RegisterPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
            email: null,
        };
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
        });
    }


    submit(data){
        this.toggle();
        console.log(data);
        const {token, password, email} = data;

        axiosInstance.post(PASSWORD_RESET, {passwordToken: token, password, email})
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
                })
            });

  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`Reset Password - ${appName}`}</title>
        </Helmet>
    );
  }

    render() {
      const { handleSubmit } = this.props

      return (

          <section className="contactPage_wrap">
          {this.head()}
            <InternalTextBanner Heading="Reset Password" wrapperClass="contact" />
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">

                            {
                                !this.state.showForm ? <div className="confirm_email_block">
                                    <div className="confirm_email_check">
                                        Password reset successful
                                    </div>
                                    <Link className="proceed-to-link" to="/login">Proceed to login</Link>

                                </div> : <form onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">


                                        <div className="form_row">
                                            <Field
                                                name="email"
                                                component={renderTextField}
                                                label="Email:"
                                                className="login-email"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="token"
                                                component={renderTextField}
                                                label="Password Token:"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="password"
                                                component={renderTextField}
                                                label="Password:"
                                                type="password"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="confirmPassword"
                                                component={renderTextField}
                                                label="Confirm Password:"
                                                type="password"
                                            />
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
                                                Reset
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


  RegisterPage = reduxForm({
      form: 'resetForm',
      validate,
      enableReinitialize: true,
  })(RegisterPage);


function mapStateToProps(state){
    return {
        user: state.user
    };
};

export default {
  component: connect(mapStateToProps)(RegisterPage)
};
