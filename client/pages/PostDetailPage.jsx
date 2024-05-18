// PostingDetailPage.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';

export default function PostingDetailPage ({ route, navigation }) {
  const { post } = route.params;
  const [likes, setLikes] = useState(post.like || 0);
  const [comments, setComments] = useState(post.comment || []);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleLike = () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ like: updatedLikes })
    }).catch(error => console.error('Error updating likes:', error));
  };

  const handleComment = () => {
    const updatedComments = [...comments, { username: 'currentUser', content: newComment }];
    setComments(updatedComments);
    setNewComment('');
    fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: updatedComments })
    }).catch(error => console.error('Error updating comments:', error));
  };

  const handleModify = () => {
    navigation.navigate('PostingPage', { post: { ...post, content: editContent } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>{post.username}</Text>
        {!isEditing ? (
          <Text style={styles.fullContent}>{post.content}</Text>
        ) : (
          <TextInput
            style={styles.input}
            multiline
            value={editContent}
            onChangeText={setEditContent}
          />
        )}
        <View style={styles.interactionContainer}>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Icon name="thumb-up" size={20} color="#fff" />
            <Text style={styles.likeText}>{likes} Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Comments</Text>
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentUser}>{comment.username}:</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment"
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Comment" onPress={handleComment} />
        </View>
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
  content: {
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  author: {
    fontSize: 18,
    marginBottom: 10
  },
  fullContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    minHeight: 100
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  likeButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  likeText: {
    marginLeft: 5,
    color: '#fff'
  },
  editButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 5
  },
  editButtonText: {
    color: '#fff'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  commentsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 5
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 5
  },
  commentContent: {
    flex: 1,
    fontSize: 16
  },
  commentInput: {
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: '10%',
    marginBottom: 10
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff'
  }
});
