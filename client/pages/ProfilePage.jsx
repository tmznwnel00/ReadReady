import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

// Fallback component for Web using iframe
const WebFallback = ({ uri }) => (
  <iframe src={uri} style={styles.iframe} title="Graph" />
);

export default function ProfilePage({ navigation }) {
    
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            setUsername(storedUsername);
    
            // Fetch user data based on stored username
            const userDataResponse = await fetch(`http://127.0.0.1:8000/user/data?username=${storedUsername}`);
            const userData = await userDataResponse.json();
        };
    
        fetchUsername();
    }, []);
    


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Analysis</Text>
                

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Books Analysis Graph</Text>
                    <View style={styles.graphContainer}>
                        {username ? (
                            Platform.OS === 'web' ? (
                                <WebFallback uri={`http://127.0.0.1:8000/analysis?username=${username}`} />
                            ) : (
                                <WebView
                                    source={{ uri: `http://127.0.0.1:8000/analysis?username=${username}` }}
                                    style={styles.graph}
                                />
                            )
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Daily Progress Graph (Last 7 days)</Text>
                    <View style={styles.graphContainer}>
                        {username ? (
                            Platform.OS === 'web' ? (
                                <WebFallback uri={`http://127.0.0.1:8000/daily_progress_graph?username=${username}`} />
                            ) : (
                                <WebView
                                    source={{ uri: `http://127.0.0.1:8000/daily_progress_graph?username=${username}` }}
                                    style={styles.graph}
                                />
                            )
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
            <Navbar navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
    },
    content: {
        padding: 20,
        height: 800,
    },
    title: {
        marginTop: '20%', 
        marginBottom: '20%',
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
        alignSelf: 'center', 
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'BIZUDGothic', 
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    graphContainer: {
        height: 400,  
    },
    graph: {
        flex: 1,
    },
    fallbackContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
    },
    fallbackText: {
        fontSize: 18,
        color: '#666',
    },
    iframe: {
        width: '100%',
        height: '100%',
        borderWidth: 0,
    },
});
