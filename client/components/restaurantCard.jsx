import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { Gen } from "../helpers/gen";
import RatingComponent from "./ratingComponent";


class RestaurantCard extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			currentTime: ''
		}
	}

	restaurantClicked() {
		this.props.history.push( `/restaurant/${this.props.restaurant.id}` );
	}

	render() {
		const { id, name, userId, address, createdAt, rating, updatedAt } = this.props.restaurant;
		const {currentTime} = this.state;
		return (
			<Row className="restaurant-card-container" onClick={this.restaurantClicked.bind( this )}>
				<Col className="restaurant-image-container" xs={3} md={3}>
					<img alt="restaurant icon" className="restaurant-image" src={`/assets/graphics/restauranticon.png`}/>
				</Col>

				<Col className="restaurant-info-container" xs={6} md={6}>
					<div className="restaurant-title">
						Name: {name}
					</div>
					<div className="restaurant-class">
						Created at: { Gen.getDateFromISODate(createdAt) }
					</div>
					<Row>
						<Col xs={6} className="restaurant-area">
							Address: {address}
						</Col>
					</Row>

					<div className="restaurant-sts">
					</div>

					<div className="restaurant-title">
						rating {rating}
					</div>
				</Col>

				<Col className="arrow" xs={3} md={3}>
					<RatingComponent initialRating={rating} onChange={()=>{}} readOnly={true} />
				</Col>
			</Row>
		);
	};
}

RestaurantCard.propTypes = {
	restaurant: PropTypes.object.isRequired
};

export default withRouter( RestaurantCard );
