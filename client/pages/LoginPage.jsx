import React, {useState} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    AsyncStorage.setItem('username', username);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.status === 200) {
                await AsyncStorage.setItem('username', username);
                Alert.alert('Login Successful', `Welcome ${username}!`);
                navigation.navigate('Home');
            } else {
                Alert.alert('Login Failed', data.error || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
        }
    };
    

       return (
        <View style={styles.loginContainer}>
            <Text style={styles.title}>LOGIN</Text>
            <Image source={require('../assets/Logo.png')} style={styles.logo} />

            <TextInput
                style={styles.input}
                placeholder="ID"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FEF9F2',
        
    },
    title: {
        marginTop:'30%',
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
    },
    logo: {
        width: 250,
        height: 250, 
        resizeMode: 'contain',
        marginVertical: 10,
    },

    input: {
        width: '70%',
        height: 50,
        margin: 12,
        borderWidth: 0,
        backgroundColor:'#fff',
        padding: 10,
        fontFamily: 'BIZUDGothic',
        borderRadius: 5,
        fontSize:20, 
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 30,
        width: '30%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'BIZUDGothic',
    },
});