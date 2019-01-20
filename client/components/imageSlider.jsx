import React, {Component} from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';

class ImageSlider extends Component {

    constructor(props){
        super(props);
        this.state = {
            images_loaded: false
        }
    }

    componentDidMount(){
        this.setState({images_loaded : true});
    }

    render(){
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            arrows: true,
            fade: false,
        };

        return(
            <div className="meetTheTeam">

                <div className={classNames({'banner_scroller': true, 'loaded': this.state.images_loaded })}>

                    <Slider {...settings}>
                        {
                            this.props.images.map(image => (<div key={image.toString()} className="item">
                                <div className="profilePic">
                                    <img src={image} />
                                </div>
                            </div>) )
                        }
                    </Slider>
                </div>



            </div>
        )
    };
}

export default ImageSlider;
