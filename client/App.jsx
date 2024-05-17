import * as React from 'react';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CommunityPage from './pages/CommunityPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ResultPage from './pages/ResultPage';
import DetailPage from './pages/DetailPage';
import PostingPage from './pages/PostingPage';
import ProgressPage from './pages/ProgressPage';
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
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf')
  });


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={CommunityPage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={SearchPage} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={ResultPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Detail" component={DetailPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Progress" component={ProgressPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Posting" component={PostingPage} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
  
}
