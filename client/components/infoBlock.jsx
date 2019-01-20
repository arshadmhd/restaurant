import React, {Component} from 'react';
import PropTypes from 'prop-types';

class InfoBlock extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className={`info-block-container ${this.props.wrapperClass}`}>
                <h1 className="small-header">
                    {this.props.heading}
                </h1>

                {
                    this.props.isBig ? <h2 className="big-timer">
                        {this.props.info}
                    </h2> : <p className="description">
                        {this.props.info}
                    </p>
                }
            </div>
        )
    };
}

InfoBlock.propTypes = {
    heading: PropTypes.string,
    info: PropTypes.any,
    isBig: PropTypes.bool,
};

export default InfoBlock;
