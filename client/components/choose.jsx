import React, {Component} from 'react';
import PropTypes from 'prop-types';


class Choose extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className={`${this.props.wrapperClassName} choose-container`}>
                <h1 className="choose-header">
                    {this.props.title}
                </h1>
                <div className="options-wrapper">
                    {
                        this.props.options.map((option, index) => (<div key={index} className="option-container">
                            <div className="option-item">
                                {option}
                            </div>
                        </div>) )
                    }

                </div>
            </div>
        )
    };
}

Choose.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    wrapperClassName: PropTypes.string,
}

export default Choose;