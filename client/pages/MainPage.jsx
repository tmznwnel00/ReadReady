import React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';

export default function MainPage({ navigation }) {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/Bookmark.png')} style={styles.bookmark} />
            <Text style={styles.title}>Read, Ready?</Text>
            <Image source={require('../assets/Logo.png')} style={styles.logo} />
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
            >

                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Signup')} 
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.purpleBox}>
                <Text style={styles.purpleBoxText}>I know what you will read{'\n'}for a lifetime...</Text>
            </View>
            {/*<Button title="Home" onPress={() => navigation.navigate('Home')}/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontFamily: 'Bokor-Regular', 
    },
    bookmark: {
        width: 40,
        alignSelf: 'flex-end',
        marginRight: 25,
    },
    logo: {
        width: 250,
        height: 250, 
        resizeMode: 'contain',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10, 
        width: '60%',
        height: 50, 
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: 'BlackAndWhite',
        justifyContent: 'center',
    },
    purpleBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#8F1431',
        justifyContent: 'center',
        padding: 20,
        height: '20%',
    },
    purpleBoxText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 25,
        fontFamily: 'BlackAndWhite',
        lineHeight: 30,
        
    },
});
