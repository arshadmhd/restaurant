import React, {Component} from 'react';
import {renderRoutes} from 'react-router-config';
import Header from './components/header';
import Footer from './components/footer';
import Notifications from 'react-notify-toast';
import { withRouter } from 'react-router-dom';

class App extends Component {
    componentDidCatch(error, info) {
        console.log(error);
    }
    render() {
        const options = {
            zIndex: 99999,
            top: '30px'
        };
        return (
            <div className="default_layout">
                <Notifications options={options} />
                <Header />
                {renderRoutes(this.props.route.routes)}
                <Footer/>
            </div>
        );
    }
}

export default {
    component: withRouter(App)
};
