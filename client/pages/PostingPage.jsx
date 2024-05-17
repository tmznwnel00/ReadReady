import React, { useState } from 'react';
import {  StyleSheet,  View,  TextInput,  Button,  Text,  SafeAreaView,  ScrollView,  TouchableOpacity } from 'react-native';

const PostingPage = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    useEffect(() => {
        // Load the username from AsyncStorage
        const loadUsername = async () => {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername);
    };

    loadUsername();
    }, []);

    const handleSubmit = () => {
        const postData = {
        title,
        content,
        username,
        like: 0,
        comment: 0,
        createdAt: new Date().toISOString()
    };

        // Replace 'http://<your-server-ip>:8000/posting/' with your server URL
        fetch('http://127.0.0.1:8000/posting', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        navigation.goBack(); // Navigate back to the community page
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter the title of your post"
            />
            <Text style={styles.label}>Content</Text>
            <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Enter the content of your post"
            multiline={true}
            numberOfLines={4}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </ScrollView>
        </SafeAreaView>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
    },
    contentContainer: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        fontSize: 18,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    textArea: {
        height: 120,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    }
    });

    export default PostingPage;
