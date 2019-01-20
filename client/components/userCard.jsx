import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, Row} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import {Gen} from "../helpers/gen";

class UserCard extends Component {

    restaurantClicked() {
        this.props.history.push(`/user/${this.props.user.id}`);
    }

    render(){
        const {id, email, name, gender, role, status, createdAt, updatedAt} = this.props.user;
        return(
            <Row className="restaurant-card-container" onClick={this.restaurantClicked.bind(this)}>
                <Col className="restaurant-image-container" xs={4} md={3}>
                    <img className="restaurant-image" src="https://www.mykhel.com/thumb/247x100x233/cricket/players/9/11419..jpg" />
                </Col>

                <Col className="restaurant-info-container" xs={8} md={9}>
                    <div className="restaurant-title" >
                        {name}
                    </div>
                    <div className="restaurant-class">
                        {`gender: ${gender} `}
                    </div>
                    <div className="restaurant-class">
                        {`role: ${role} `}
                    </div>
                    <div className={`${status === 'active' ? 'green' : 'red'} restaurant-class`}>
                        {`status: ${status} `}
                    </div>

                    <Row>
                        <Col xs={6} className="restaurant-area">
                            {email}
                        </Col>
                        <Col xs={6} className="restaurant-rate">
                            {`createdAt: ${Gen.getDateFromISODate(createdAt)}`}
                        </Col>
                    </Row>
                    <div className="restaurant-sts">
                        {`updatedAt: ${Gen.getDateFromISODate(updatedAt)}`}
                    </div>
                </Col>
            </Row>
        )
    };
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
}

export default withRouter(UserCard);
