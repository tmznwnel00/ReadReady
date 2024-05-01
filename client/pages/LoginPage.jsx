import React, {useState} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';

export default function LoginPage({ navigation }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: id, password })
            });
            const data = await response.json();
            if (response.status === 200) {
                Alert.alert('Login Successful', `Welcome ${id}!`);
                navigation.navigate('Home');  // Ensure you have a 'Main' route configured in your navigation
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
                value={id}
                onChangeText={setId}
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