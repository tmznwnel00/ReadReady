import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example using MaterialCommunityIcons

const Navbar = ({ navigation }) => {
    return (
        <View style={styles.navbarContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Icon name="clipboard-edit-outline" style={styles.navIcon} onPress={() => navigation.navigate('Home')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Icon name="magnify" style={styles.navIcon} onPress={() => navigation.navigate('Home')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Icon name="home-outline" style={styles.navIcon} onPress={() => navigation.navigate('Home')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Icon name="account-circle-outline" style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Icon name="account-group-outline" style={styles.navIcon} onPress={() => navigation.navigate('Community')}/>
            </TouchableOpacity>
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
        marginleft: '5%',
    },
});

export default Navbar;
