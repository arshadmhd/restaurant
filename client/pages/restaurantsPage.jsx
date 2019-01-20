import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Col, Grid, Row} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from '../components/banners/internalTextBanner';
import {clearNextUrl, fetchRestaurantsAction} from '../actions';
import {Helmet} from 'react-helmet';
import RestaurantCard from "../components/restaurantCard";
import Filter from "../components/filter";
import DropdownList from "react-widgets/lib/DropdownList";

class Restaurants extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showFilterOnMobile: false,
            filters: {
                order: 'desc'
            },
        };
    }

    componentDidMount(){
        this.props.clearNextUrl();
        const id = this.props.match.params.id;
        if(id)
            this.props.fetchRestaurantsAction({userId: [id], order: this.state.filters.order});
        else
            this.props.fetchRestaurantsAction({order: this.state.filters.order});
    }

    orderChanged(newData) {
        const order = newData === 'highest first' ? 'desc' : 'asc';
        const data = {
            ...this.state.filters, order
        };
        this.fetchRestaurantAndHideFilterOnMobile(data);
    }

    loadMoreClicked() {
        this.props.fetchRestaurantsAction(this.state.filters);
    }

    renderRestaurants() {
        if (this.props.restaurants !== false) {
            const restaurantsData = this.props.restaurants.map((restaurant, index) => {
                return (
                    <div key={index} className="restaurant">
                        <RestaurantCard restaurant={restaurant}/>
                    </div>
                );
            });

            return (<div>
                {restaurantsData}
                    <div className={`${this.props.nextUrl ? '' : 'hidden'} load-more-container`}>
                        <div className="load-more" onClick={this.loadMoreClicked.bind(this)}> Load more</div>
                    </div>
                </div>
            );
        }
    }

    showFilter() {
        this.setState({
            showFilterOnMobile: true,
            filters: this.state.filters
        })
    }

    hideFilter() {
        this.setState({
            showFilterOnMobile: false,
            filters: this.state.filters
        })
    }

    head(){
        return (
            <Helmet bodyAttributes={{class: "postsPage"}}>
                <title>{`Restaurants Page`}</title>
            </Helmet>
        );
    }

    fetchRestaurantAndHideFilterOnMobile(data) {
        this.props.clearNextUrl();
        this.props.fetchRestaurantsAction(data);
        this.setState({
            showFilterOnMobile: false,
            filters: data
        })
    }

    render() {
        const {restaurants} = this.props;
        const userId = this.props.match.params.id;
        if(this.props.restaurants){
            return(
                <div className="restaurants-page">
                    {this.head()}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <Grid className="restaurants">

                            <div className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'} show-filter-button`} onClick={this.showFilter.bind(this)}>
                                filter
                            </div>

                            <Row>
                                <div className='restaurants-order'>
                                    <DropdownList
                                          data={['highest first', 'lowest first']}
                                          onChange={this.orderChanged.bind(this)}
                                          value={this.state.filters.order === 'asc' ? 'lowest first' : 'highest first'}
                                    />
                                </div>
                            </Row>

                            <Row>
                                <Col className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={8}>
                                    {
                                        (restaurants.length > 0) ? this.renderRestaurants()
                                            :
                                            <div className="no-result">
                                                <h2> Oops!!! No restaurants</h2>
                                                <h2> Try to widen your search</h2>
                                            </div>
                                    }
                                </Col>

                                <Col className={`${!this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={4}>
                                    <Filter user={this.props.user} applyFilter={this.fetchRestaurantAndHideFilterOnMobile.bind(this)} userId={userId ? userId: ''} />
                                </Col>

                            </Row>
                        </Grid>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div>
                    {this.head()}
                    <InternalTextBanner Heading="" wrapperClass="posts" />
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                        <div className="main anim-appear">
                            <div className="grid">
                                <div className="column column_8_12">
                                    <div className="posts">

                                    </div>
                                </div>
                                <div className="column column_4_12">

                                </div>
                            </div>
                        </div>
                    </ReactCSSTransitionGroup>
                </div>);
        }
  }
}

function mapStateToProps(state){
    return {
        restaurants: state.restaurants.arr,
        nextUrl: state.restaurants.nextUrl,
        user: state.user,
    };
};

function loadData(store){
    return store.dispatch(fetchRestaurantsAction());
}

export default {
    loadData,
    component: connect(mapStateToProps, { fetchRestaurantsAction, clearNextUrl })(Restaurants)
};

