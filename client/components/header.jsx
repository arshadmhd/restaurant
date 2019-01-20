import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import webConfig from './../../webConfig';
import classNames from 'classnames';
import {clearUserDetails, fetchUserDetails} from "../actions";
import {Gen} from "../helpers/gen";

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vPos : 0,
            mobileToggle: false
        };
        this.listenScrollEvent = this.listenScrollEvent.bind(this);
    }

    logout(e) {
        e.preventDefault();
        this.props.clearUserDetails();
    }

    listenScrollEvent(event) {
        this.setState({
            vPos: event.target.body.scrollTop
        });
    }

    toggleMobileNav(){
        this.setState({
            mobileToggle: !this.state.mobileToggle
        });
    }

    componentDidMount() {
        if(!(window.location.href.includes("/login") || window.location.href.includes("/register"))) {
            this.props.fetchUserDetails();
        }
        window.addEventListener('scroll', this.listenScrollEvent);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenScrollEvent);
    }

    render() {
        const {user} = this.props;

        return (

            <header onScroll={this.listenScrollEvent} className={classNames({'scrollActive': this.state.vPos > 0, 'mobileNavActive': this.state.mobileToggle })}>

                <div className="wrap">

                    <div className="logo_wrap">
                        <Link to="/">
                            <img src={`${webConfig.siteURL}/assets/graphics/logo.png`} alt="Logo" className="dark"/>
                            <img src={`${webConfig.siteURL}/assets/graphics/logo_white.png`} alt="Logo" className="white"/>
                        </Link>
                    </div>

                    <div className="mobile">
                        <span className={classNames({'icon': true, 'mobileNavActive': this.state.mobileToggle })} onClick={this.toggleMobileNav.bind(this)}>
                            <span></span>
                        </span>
                    </div>

                    <div className={classNames({'nav_wrap': true, 'mobile_active': this.state.mobileToggle })}>
                        <nav>
                            <ul>

                                <li className="first">
                                    <NavLink activeClassName="active" to="/restaurants">Home</NavLink>
                                </li>

                                {
                                    Gen.isUserAdmin(user) ?
                                        <li>
                                            <NavLink activeClassName="active" to="/users">Users</NavLink>
                                        </li> : ''
                                }

                                {
                                    Gen.isUserManager(user) ?
                                        <li>
                                            <NavLink activeClassName="active" to="/reviews/pending">Pending reviews</NavLink>
                                        </li>: ''
                                }

                                {
                                    Gen.isUserManager(user) ?
                                        <li>
                                            <NavLink activeClassName="active" to="/restaurant/add">Add Restaurant</NavLink>
                                        </li>: ''
                                }

                                {
                                    user ? <li className="last">
                                        <NavLink activeClassName="active" to="/user/profile">{user.name}</NavLink> </li>: <li className="last">
                                        <NavLink activeClassName="active" to="/register">Login/Register</NavLink> </li>
                                }
                            </ul>
                        </nav>
                    </div>

                </div>

            </header>

        );
    }
};

function mapStateToProps(state){
    return {
        user: state.user
    };
};


export default connect(mapStateToProps, { fetchUserDetails, clearUserDetails })(Header);
