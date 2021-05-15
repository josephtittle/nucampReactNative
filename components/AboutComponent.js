import { PARTNERS } from '../shared/partners';
import React, { Component } from 'react';
import { Card, ListItem } from 'react-native-elements';
import { Text, ScrollView, FlatList } from 'react-native';

class Mission extends Component {
    render() {
        return (
            <Card title= "Our Mission">
                <Text style={{ margin: 10 }}>
                    We present a curated database of the best campsites in the vast woods and backcountry of the World Wide Web Wilderness. We increase access to adventure for the public while promoting safe and respectful use of resources. The expert wilderness trekkers on our staff personally verify each campsite to make sure that they are up to our standards. We also present a platform for campers to share reviews on campsites they have visited with each other.
                </Text>
            </Card>
        )
    }

}

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partners: PARTNERS
        }
    }

    static navigationOptions = {
        title: 'About Us'
    }

    render() {
        const renderPartners = ({ item }) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{ source: require('./images/bootstrap-logo.png') }}
                />
            );
        };

        return (
            <ScrollView>
                <Mission />
                <Card title={"Community Partners"}>
                    <Text style={{
                        margin: 10,
                        fontWeight: 'bold', textAlign: 'center', marginBottom: 10
                    }}>
                        Community Partners
                    </Text>
                    <FlatList
                        data={this.state.partners}
                        renderItem={renderPartners}
                        keyExtractor={item => item.id.toString()} />
                </Card>
            </ScrollView>
        );
    }
}



export default About;