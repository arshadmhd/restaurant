import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {

    return (
        <footer className="footer-container">
            <div className="wrap">
                <div className="clearFloat">
                    <div className="left">
                        <div className="copyright">
                            &copy; 2019 Restaurantr. All Rights Reserved.
                        </div>
                    </div>
                    <div className="right">
                        <div className="footer_nav">
                            <ul>
                                <li>
                                    <Link to="/policies/terms">Terms</Link>
                                </li>
                                <li>
                                    <Link to="/policies/privacy">Privacy policy</Link>
                                </li>
                                <li>
                                    <Link to="/policies/cookies">Cookies policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
