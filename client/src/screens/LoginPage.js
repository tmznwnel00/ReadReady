import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginPage = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Page</Text>
      <Button title="Log In" onPress={() => navigation.navigate('Main')} />
      <Text></Text>
    </View>
  );
}

export default LoginPage;
