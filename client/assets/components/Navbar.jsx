import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example using MaterialCommunityIcons

const Navbar = ({ navigation }) => {
    return (
        <View style={styles.navbarContainer}>

                <Icon name="bookshelf" style={styles.navIcon} onPress={() => navigation.navigate('Library')}/>

                <Icon name="magnify" style={styles.navIcon} onPress={() => navigation.navigate('Search')}/>

                <Icon name="home-outline" style={styles.navIcon} onPress={() => navigation.navigate('Home')}/>

                <Icon name="account-circle-outline" style={styles.navIcon} onPress={() => navigation.navigate('Library')}/>

                <Icon name="account-group-outline" style={styles.navIcon} onPress={() => navigation.navigate('Community')}/>

        </View>
    );
};

const styles = StyleSheet.create({
    navbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#000',
        height: 80,
    },   
    navIcon: {
        color: '#fff',
        fontSize: 50,
    
    },
});

export default Navbar;
