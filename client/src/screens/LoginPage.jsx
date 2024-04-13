import React, {useState} from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import styled from 'styled-components';

const LoginContainer = styled.view`
  flex:1,
  justifyContent: 'center',
  alignItems: 'center',
  alignItems: 'center',
  padding: 20
`

const IDInput = styled.div`
  width: 70%;
  height: 40px;
  margin:12px;
  borderWidth: 1px solid #ccc;
  padding: 10px;
`

const PasswordInput = styled.div`
  width:'70%',
  height: 40,
  margin:!2,
  borderWidth: 1,
  padding: 10
`

const LoginPage = () => {
  const [id,setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://~~~~', {
        method: 'POST',
        headers: {
          'Content-Type': 'applcation/json'
        },
        body: JSON.stringfy({ id, password })
      });
      const data = await response.json()
      if (response.status === 200) {
        Alert.alert('Login Successful',`Welcome ${id}!`);
        navigation.navigate('Main');
      }
      else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <LoginContainer>
      <Text>Login Page</Text>
      <IDInput
        placeholer="ID"
        value={id}
        onChangText={setId}>
      </IDInput>

      <PasswordInput
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}>
      </PasswordInput>

      <Button
        title="Login"
        onPress={handleLogin}>
      </Button>
      <Button title="Log In" onPress={() => navigation.navigate('Main')} />
      <Text></Text>
    </LoginContainer>
  );
};

export default LoginPage;
