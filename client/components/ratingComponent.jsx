import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

class RatingComponent extends Component {
    render(){
        let {onChange, readOnly = false, initialRating = 0} = this.props;
        return <Rating
            readonly={readOnly}
            onChange={onChange}
            initialRating={initialRating}
            emptySymbol={<img src="/assets/graphics/rating-blank.png" style={{width: '20px', height: '20px'}} className="icon" />}
            fullSymbol={<img src="/assets/graphics/rating-fill.png" style={{width: '20px', height: '20px'}} className="icon" />}
        />
    };
}

RatingComponent.proptypes = {
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.boolean,
    initialRating: PropTypes.number.isRequired,
};

export default RatingComponent;
