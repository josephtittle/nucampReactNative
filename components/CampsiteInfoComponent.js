import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native'
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
//import { CAMPSITES } from '../shared/campsites' ---- removed when added redux to fetch via json-server ------
//import { COMMENTS } from '../shared/comments' ---- removed when added redux to fetch via json-server ------
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId))
};

// use the property of the campsite object so can destructure
function RenderCampsite(props) {

    const {campsite} = props;

    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{uri: baseUrl + campsite.image}}>
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                <Icon
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    raised
                    reverse
                    onPress={() => props.favorite ? 
                        console.log('Already set as a favorite') : props.markFavorite()}
                />
                <Icon
                    name={'pencil'}
                    type='font-awesome'
                    color='#5637DD'
                    raised
                    reverse
                    onPress={() => props.onShowModal()}
                />
                </View>
            </Card>
        );
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class CampsiteInfo extends Component {
    // create a constructor and initialize a state property in the typical way. In the state object, initialize a property named showModal to false. 
    constructor(props) {
        super(props)
        this.state = {
            rating: 5,
            author: '',
            text: '',
            showModal: false
        }
    }

    // Event handler to show and hide the Modal: Add a toggleModal method to the CampsiteInfo component. copy same method from Reservation component.

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    handleComment(campsiteId) {
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text, )
        this.toggleModal()
    }
    // will now need to pass this event handler as one of the props from the CampsiteInfo component to the RenderCampsite component.

    resetForm() {
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        })
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    // returns boolean if array includes the favorited campsite id then pass value to RenderCampsite component
                    markFavorite={() => this.markFavorite()}
                    onShowModal={() => this.toggleModal()}
                    // Add the Modal: Set up Modal component that will allow you to add comments to a campsite. Use the Modal from the Reservation component as guide
                    // use the same animationType, transparent, visible, and onRequestClose props. Add it just before the end of the Scrollview component in the CampsiteInfo component. 
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        {/* <Text style={styles.modalTitle}>Search Campsite Reservations</Text>
                        <Text style={styles.modalText}>
                            Number of Campers: {this.state.campers}
                        </Text>
                        <Text style={styles.modalText}>
                            Hike-In?: {this.state.hikeIn ? 'Yes' : 'No'}
                        </Text>
                        <Text style={styles.modalText}>
                            Date: {this.state.date.toLocaleDateString('en-US')}
                        </Text> */}
                        <View style={{margin: 10}}>
                        <Button
                            onPress={() => {
                                this.toggleModal();
                                this.resetForm();
                            }}
                            color='#808080'
                            title='Cancel'
                        />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);