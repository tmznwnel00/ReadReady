import * as React from 'react';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CommunityPage from './pages/CommunityPage';
import HomePage from './pages/HomePage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    'Bokor-Regular': require('./assets/fonts/Bokor-Regular.ttf'),
    'BIZUDGothic': require('./assets/fonts/BIZUDGothic-Regular.ttf'),
    'BlackAndWhite': require('./assets/fonts/BlackAndWhitePicture-Regular.ttf'),
    'BlackHanSans-Regular': require('./assets/fonts/BlackHanSans-Regular.ttf'),
  });


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={CommunityPage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        {/* Define other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  )
  
}