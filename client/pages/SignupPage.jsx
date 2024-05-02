import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';

export default function SignupPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [id, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (response.status === 200) {
                Alert.alert('Registration Successful', 'You can now login.');
                navigation.navigate('LoginPage');
            } else {
                Alert.alert('Registration Failed', data.error || 'Please try again.');
            }
        } catch (error) {
            Alert.alert('Network Error', 'Unable to connect to the server. Please try again.');
        }
    };
    

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.title}>SIGN UP</Text>
            <Image source={require('../assets/Logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <Text style={styles.inputTextEmail}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputTextID}>ID</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />
                </View>
                <View style={styles.inputContainer}>
                <Text style={styles.inputTextPassword}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
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
        marginTop: '30%',
        fontSize: 40,
        fontFamily: 'BIZUDGothic',
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },
    inputTextEmail: {
        width: '20%',
        fontSize: 18,
        fontFamily: 'BIZUDGothic',
        textAlign: 'right',
        marginRight: 5,
    },
    inputTextID: {
        width: '20%',
        fontSize: 20, 
        fontFamily: 'BIZUDGothic',
        textAlign: 'right',
        marginRight: 5,
    },
    inputTextPassword: {
        width: '20%',
        fontSize: 16,
        fontFamily: 'BIZUDGothic',
        textAlign: 'right',
        marginRight: 5,
    },
    input: {
        width: '70%',
        height: 50,
        margin: 12,
        borderWidth: 0,
        backgroundColor: '#fff',
        padding: 10,
        fontFamily: 'BIZUDGothic',
        borderRadius: 5,
        fontSize: 20,
    },
    button: {
        backgroundColor: '#2F2F2F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 30,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'BIZUDGothic',
    },
});
