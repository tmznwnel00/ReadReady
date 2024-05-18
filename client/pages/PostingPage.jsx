import React, { useState } from 'react';
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
        <ScrollView style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title"
          />
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.textarea}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="Enter post content"
          />
          <Button title={isEditing ? 'Update Post' : 'Add Post'} onPress={handleSubmit} />
        </ScrollView>
        <Navbar navigation={navigation} />
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FEF9F2'
    },
    form: {
      padding: 20
    },
    label: {
      fontSize: 18,
      marginBottom: 5
    },
    input: {
      fontSize: 16,
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10
    },
    textarea: {
      fontSize: 16,
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 10,
      height: 100,
      textAlignVertical: 'top',
      marginBottom: 10
    }
  });