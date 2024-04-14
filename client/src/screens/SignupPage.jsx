import React, {useState} from 'react';
import { View, Text, Button, Alert } from 'react-native';
import styled from 'styled-components';

const SignupView = styled.view`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`
const EmailInput = styled.TextInput`
  width: 70%;
  height: 40px;
  margin:12px;
  borderWidth: 1px solid #ccc;
  padding: 10px;
`
const IDInput = styled.TextInput`
  width: 70%;
  height: 40px;
  margin:12px;
  borderWidth: 1px solid #ccc;
  padding: 10px;
`
const PasswordInput = styled.TextInput`
  width: 70%;
  height: 40px;
  margin:12px;
  borderWidth: 1px solid #ccc;
  padding: 10px;
`

const SignupPage = ({ navigation }) => {
  const [name, setEmail] = useState('')
  const [id,setId] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('https://~~~~~', {
        method: 'POST',
        headers: {
          'Content-Type': 'applcation/json'
        },
        body: JSON.stringfy({ name, id, password })
      });
      const data = await response.json()
      if (response.status === 200) {
        navigation.navigate('Login');
      }
      else {
        Alert.alert('Failed to register. Please try again.', data.message);
      }
    }
    catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again.');
    }
  }
  
  return (
    <SignupView>
      <Text>Signup Page</Text>
      <EmailInput
        placeholeder="Enter your email"
        value={name}
        onChangeText={setName}
        autoCapitalizae="none">
      </EmailInput>
      <IDInput
        placeholder="Enter your ID"
        value={id}
        onChangeText={setId}
        autoCapitalizae="none">
      </IDInput>
      <PasswordInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEngry={true}
        autoCaptialize="none">
      </PasswordInput>
      <Button title="Register" onPress={handleRegister} />
      <Text></Text>
    </SignupView>
  );
}

export default SignupPage;
