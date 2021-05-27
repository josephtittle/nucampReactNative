import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet, Alert } from 'react-native'
import { ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import Loading  from './LoadingComponent'
import { baseUrl } from '../shared/baseUrl'
import { SwipeRow } from 'react-native-swipe-list-view'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { deleteFavorite } from '../redux/ActionCreators'
import * as Animatable from 'react-native-animatable'

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        favorites: state.favorites
    }
}

const mapDispatchtoProps = {
    deleteFavorite: campsiteId => deleteFavorite(campsiteId)
}

class Favorites extends Component {
    static navigationOptions = {
        title: 'My Favorites'
    }
    render() {
        const { navigate } = this.props.navigation

        const renderFavoriteItem = ({item}) => {
            return (
                <SwipeRow rightOpenValue={-100} style={styles.swipeRow}>
                    {/* the amount of pixels needed to be swiped to show option */}
                    <View style={styles.deleteView}>
                        <TouchableOpacity
                            style={styles.deleteTouchable}
                            // onPress={() => this.props.deleteFavorite(item.id)} ---- non-alert version ----
                            onPress={() =>
                                Alert.alert(
                                    'Delete Favorite?', //1st parameter: title 
                                    'Are you sure you wish to delete the favorite campsite ' + item.name + '?', //2nd parameter: dialogue box
                                    // 3rd parameter: set of actions alert needs to support provided as an array of objects
                                    // each item in array represents a button
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log(item.name + 'Not Deleted'),
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'OK',
                                            onPress: () => this.props.deleteFavorite(item.id)
                                        }
                                    ],
                                    { cancelable: false }
                                    // optional parameter: android can't tap outside of alert box to cancel, must tap 'cancel' or 'ok'

                                )
                            }
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                    {/* first view is hidden view */}
                    <View>
                        <ListItem
                            title={item.name}
                            subtitle={item.description}
                            onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })}
                            leftAvatar={{source: {uri: baseUrl + item.image}}}
                        />
                    </View>
                    {/* second view is default shown view */}
                </SwipeRow>
            )
        }

        if (this.props.campsites.isLoading) {
            return <Loading />
        }
        if (this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            )
        }
        return (
            <Animatable.View animation='fadeInRightBig' duration={2000}>
                <FlatList
                    data={this.props.campsites.campsites.filter(
                        campsite => this.props.favorites.includes(campsite.id)
                    )}
                    renderItem={renderFavoriteItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    deleteView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    deleteTouchable: {
        backgroundColor: 'red',
        height: '100%',
        justifyContent: 'center'
    },
    deleteText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
        width: 100
    }
})

export default connect(mapStateToProps, mapDispatchtoProps)(Favorites)