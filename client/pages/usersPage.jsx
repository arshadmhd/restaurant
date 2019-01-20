import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Row} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from '../components/banners/internalTextBanner';
import {clearUsersNextUrl, fetchUsersAction} from '../actions';
import {Helmet} from 'react-helmet';
import UserCard from "../components/userCard";

class UsersPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filters: {}
        };
    }

    componentDidMount(){
        this.props.clearUsersNextUrl();
        this.props.fetchUsersAction();
    }

    loadMoreClicked() {
        console.log("load more clicked")
        this.props.fetchUsersAction(this.state.filters);
    }

    renderUsers() {
        if (this.props.users) {
            const usersData = this.props.users.map((user, index) => {
                return (
                    <div key={index} className="restaurant">
                        <UserCard user={user}/>
                    </div>
                );
            });

            return (<div>
                {usersData}
                    <div className={`${this.props.nextUrl ? '' : 'hidden'} load-more-container`}>
                        <div className="load-more" onClick={this.loadMoreClicked.bind(this)}> Load more</div>
                    </div>
                </div>
            );
        }
    }



    head(){
        return (
            <Helmet bodyAttributes={{class: "postsPage"}}>
                <title>{`Users Page`}</title>
            </Helmet>
        );
    }


    render() {


        const {users} = this.props;
        if(this.props.users){
            return(
                <div className="restaurants-page">
                    {this.head()}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <Grid className="restaurants">

                            <Row>
                                {
                                    (users.length > 0) ?
                                        this.renderUsers()
                                     :
                                       <div className="no-result">
                                        <h2> Oops!!! No Results</h2>
                                        <h2> Try to widen your filter</h2>
                                       </div>
                                }
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
        users: state.users.arr,
        nextUrl: state.users.nextUrl,
    };
};

export default {
    component: connect(mapStateToProps, { fetchUsersAction, clearUsersNextUrl })(UsersPage)
};

