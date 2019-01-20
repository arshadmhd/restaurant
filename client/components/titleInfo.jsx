import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col} from 'react-bootstrap';

class TitleInfo extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const {name, date, time} = this.props;
        return(
            <Col xs={12} className="title-container" >
                <div className="title dark-text">
                    {name}
                </div>
                <div className="location light-text">
                    {date}
                </div>
                <div className="price dark-text float-left margin-right-10">
                    {time}
                </div>
            </Col>
        )
    };
}

TitleInfo.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
};

export default TitleInfo;
