// PostingDetailPage.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';

export default function PostingDetailPage ({ route, navigation }) {
    const { post } = route.params;
    const [likes, setLikes] = useState(post.likes || 0);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [currentUser, setCurrentUser] = useState(null);
  
    useEffect(() => {
      // Load the current user from storage
      const loadUser = async () => {
        const user = await AsyncStorage.getItem('username');
        setCurrentUser(user);
      };
  
      loadUser();
    }, []);
  
    const handleLike = () => {
      const updatedLikes = likes + 1;
      setLikes(updatedLikes);
      // Update likes in the backend
      fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' })
      }).catch(error => console.error('Error updating likes:', error));
    };
  
    const handleComment = () => {
      const commentData = { username: currentUser, content: newComment };
      const updatedComments = [...comments, commentData];
      setComments(updatedComments);
      setNewComment('');
      // Update comments in the backend
      fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comment', username: currentUser, content: newComment })
      }).catch(error => console.error('Error updating comments:', error));
    };
  
    const handleModify = () => {
      if (!isEditing) {
        setIsEditing(true);
      } else {
        fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editContent })
        })
        .then(response => response.json())
        .then(() => {
          setIsEditing(false);
          post.content = editContent; 
        })
        .catch(error => console.error('Error updating post:', error));
      }
    };
  
    const handleDelete = () => {
      Alert.alert(
        "Delete Post",
        "Are you sure you want to delete this post?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => deletePost() }
        ]
      );
    };
  
    const deletePost = () => {
      fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(() => {
        Alert.alert('Post Deleted', 'Your post has been deleted.');
        navigation.goBack();  // Go back to the previous screen
      })
      .catch(error => console.error('Error deleting post:', error));
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
          {currentUser === post.username && (
            <TouchableOpacity style={styles.editButton} onPress={handleModify}>
              <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          )}
          {currentUser === post.username && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Icon name="delete" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
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
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  deleteButtonText: {
    marginLeft: 5,
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
  }
});