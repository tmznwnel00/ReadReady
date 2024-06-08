import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteConfirmationModal from '../assets/components/DeleteConfirmationModal';  // Import the custom modal

export default function PostingDetailPage({ route, navigation }) {
    const { post } = route.params;
    const [likes, setLikes] = useState(post.like || 0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);  // State for modal visibility

    useEffect(() => {
        const loadUser = async () => {
            const user = await AsyncStorage.getItem('username');
            setCurrentUser(user);
        };

        loadUser();
        fetchPostData();
        fetchComments();
    }, []);

    const fetchPostData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/posting?postingId=${post.id}`);
            const updatedPost = await response.json();
            setLikes(updatedPost.like || 0);
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/comments?parentPost=${post.id}`);
            const data = await response.json();
            if (response.ok) {
                const commentsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setComments(commentsArray);
            } else {
                console.error('Error fetching comments:', data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleLike = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/posting?postingId=${post.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'like' })
            });
            setLikes(likes + 1);
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleComment = async () => {
        const commentData = { username: currentUser, content: newComment, parentPost: post.id, createdAt: Date.now() / 1000 };
        const updatedComments = [...comments, commentData];
        setComments(updatedComments);
        setNewComment('');
        try {
            await fetch(`http://127.0.0.1:8000/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });
        } catch (error) {
            console.error('Error updating comments:', error);
        }
    };

    const handleDelete = () => {
        console.log('handleDelete called');
        setModalVisible(true);  // Show the modal
    };

    const deletePost = async () => {
        try {
            console.log('Sending DELETE request to:', `http://127.0.0.1:8000/posting?postingId=${post.id}`);
            const response = await fetch(`http://127.0.0.1:8000/posting?postingId=${post.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Delete response status:', response.status);
            if (!response.ok) throw new Error('Failed to delete the post');
            Alert.alert('Post Deleted', 'Your post has been deleted.');
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Failed to delete the post');
        } finally {
            setModalVisible(false);  // Hide the modal
        }
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
                        {currentUser !== post.username && (
                            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                                <Icon name="thumb-up" size={20} color="#fff" />
                                <Text style={styles.likeText}>{likes} Likes</Text>
                            </TouchableOpacity>
                        )}
                        {currentUser === post.username && (
                            <>
                                <TouchableOpacity style={styles.modifyButton} onPress={navigateToModify}>
                                    <Icon name="pencil" size={20} color="#fff" />
                                    <Text style={styles.modifyButtonText}>Modify</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                    <Icon name="delete" size={20} color="#fff" />
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                    <Text style={styles.sectionTitle}>Comments</Text>
                    <View style={styles.commentsContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Add a comment"
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity style={styles.commentButton} onPress={handleComment}>
                            <Text style={styles.commentText}>Comment</Text>
                        </TouchableOpacity>
                        {comments.map((comment, index) => (
                            <View key={index} style={styles.comment}>
                                <Text style={styles.commentUser}>{comment.username}:</Text>
                                <Text style={styles.commentContent}>{comment.content}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <DeleteConfirmationModal  // Include the custom modal
                visible={modalVisible}
                onConfirm={deletePost}
                onCancel={() => setModalVisible(false)}
            />
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
        alignSelf: 'center',
    },
    content: {
        marginTop: 10,
        height: 600,
        alignSelf: 'center',
        width: '100%',
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
        backgroundColor: '#000',
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
        backgroundColor: '#000',
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
        backgroundColor: '#000',
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
        height: 'auto',
        marginVertical: 30,
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
    },
    commentButton: {
        backgroundColor: '#000',
        width: '60%',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    commentText: {
        color: '#fff',
        fontSize: 20,
    }
});
