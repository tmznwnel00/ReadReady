import React, { useState, useEffect } from 'react';
import {  StyleSheet,  View,  TextInput,  Button,  Text,  SafeAreaView,  ScrollView,  TouchableOpacity } from 'react-native';
import Navbar from '../assets/components/Navbar';

export default function PostingPage({ route, navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
  
    useEffect(() => {

      if (route.params && route.params.post) {
        const { post } = route.params;
        setTitle(post.title);
        setContent(post.content);
        setIsEditing(true);
      }
    }, [route.params]);
  
    const handleSubmit = () => {
      if (isEditing) {
        fetch(`http://127.0.0.1:8000/posting/${route.params.post.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(() => {
          navigation.goBack();
        })
        .catch(error => console.error('Error updating post:', error));
      } else {
        fetch('http://127.0.0.1:8000/posting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(() => {
          navigation.navigate('CommunityPage');
        })
        .catch(error => console.error('Error adding post:', error));
      }
    };
   
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>POST</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter post title"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.textarea}
              multiline
              value={content}
              onChangeText={setContent}
              placeholder="Enter post content"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isEditing ? 'Update Post' : 'Add Post'}</Text>
          </TouchableOpacity>
        </View>
        <Navbar navigation={navigation} />
      </SafeAreaView>
    );
  };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
        alignItems: 'stretch',
        justifyContent: 'space-between',
      },
      form: {
        width: '100%',
        padding: 20, 
      },
      title: {
        marginTop: '20%', 
        marginBottom: 10,
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
        alignSelf: 'center', 
      },
      inputContainer: {
        width: '90%',
        alignSelf: 'center',
      },
      label: {
        fontSize: 20,
        marginBottom: 10,
      },
      input: {
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        width: '100%',
      },
      textarea: {
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        height: 200, 
        textAlignVertical: 'top',
        marginBottom: 20,
        width: '100%',
      },
      button: {
        height: 50,  
        backgroundColor: '#000', 
        justifyContent: 'center',  
        alignItems: 'center',  
        width: '60%',  
        alignSelf: 'center', 
        marginTop: 10,  
        borderRadius:5,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18, 

      }
    });
