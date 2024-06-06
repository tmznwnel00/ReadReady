import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostingDetailPage({ route, navigation }) {
    const { post } = route.params;
    const [likes, setLikes] = useState(post.likes || 0);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const user = await AsyncStorage.getItem('username');
            setCurrentUser(user);
        };

        loadUser();
    }, []);

    const handleLike = () => {
        const updatedLikes = likes + 1;
        setLikes(updatedLikes);
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
        fetch(`http://127.0.0.1:8000/posting/${post.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'comment', username: currentUser, content: newComment })
        }).catch(error => console.error('Error updating comments:', error));
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

    const navigateToModify = () => {
        navigation.navigate('Posting', { post });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>COMMUNITY</Text>
            
                <ScrollView style={styles.content}>
                <View style={styles.scrollviewContainer}>
                    <View style={styles.nameContainer}>
                        <Icon name="account-circle" style={styles.profileIcon} />
                        <Text style={styles.author}>{post.username}</Text>
                    </View>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.fullContent}>{post.content}</Text>
                    <View style={styles.interactionContainer}>
                        {currentUser != post.username && (
                            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                                <Icon name="thumb-up" size={20} color="#fff" />
                                <Text style={styles.likeText}>{likes} Likes</Text>
                            </TouchableOpacity>
                        )}
                        {currentUser === post.username && (
                            <TouchableOpacity style={styles.modifyButton} onPress={navigateToModify}>
                                <Icon name="pencil" size={20} color="#fff" />
                                <Text style={styles.modifyButtonText}>Modify</Text>
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
        justifyContent: 'space-between',
    },
    scrollviewContainer: {
        width: '80%',
        alignSelf:'center',
    },
    content: {
        marginTop: 10,
        height: 600,
        alignSelf:'center',
        width:'100%',
    },
    title: {
        marginTop: '20%', 
        marginBottom: 30,
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
        alignSelf: 'center', 
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    profileIcon: {
        fontSize: 30,
        color: '#556080',
        marginRight: 8,
    },
    author: {
        fontSize: 18,
    },
    postTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fullContent: {
        fontSize: 16,
        color: '#333',
        marginBottom: 150,
    },
    interactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 50,
    },
    likeButton: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: -10,
    },
    likeText: {
        marginLeft: 5,
        color: '#fff',
    },
    modifyButton: {
        flexDirection: 'row',
        backgroundColor: '#f0ad4e',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: -50,
    },
    modifyButtonText: {
        marginLeft: 5,
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -50, 
    },
    deleteButtonText: {
        marginLeft: 5,
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    commentsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 10,
    },
    comment: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    commentUser: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    commentContent: {
        flex: 1,
        fontSize: 16,
    },
    commentInput: {
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    }
});
