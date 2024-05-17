import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example using MaterialCommunityIcons
import Navbar from '../assets/components/Navbar';

export default function CommunityPage({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/posting')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>COMMUNITY</Text>
            <ScrollView vertical={true} style={styles.postsList}>
                {posts.map((post, index) => (
                    <View key={index} style={styles.postCard}>
                        <View style={styles.nameContainer}>
                            <Icon name="account-circle" style={styles.profileIcon}/>
                            <Text style={styles.postUser}>{post.user} 님</Text>
                        </View>
                        <Text style={styles.postContent}>{post.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostingPage')}
      >
                <Text style={styles.addButtonText}>Add Post</Text>
            </TouchableOpacity>
            <Navbar navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    title: {
        marginTop: '20%', 
        marginBottom: 30,
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
        alignSelf: 'center', 
    },
    postsList: {
        width: '100%', // Ensures the list takes up full width
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        marginVertical: 15,
        marginHorizontal: '10%', // Maintains horizontal spacing
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nameContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 20, 
    },
    profileIcon: {
        fontSize: 30,
        color: '#556080', 
        marginRight: 8, 
    },
    postUser: {
        fontSize: 18,
        marginBottom: 4, 
    },
    postContent: {
        fontSize: 14,
        lineHeight: 30,
    },
    addButton: {
        backgroundColor: '#007bff',
        marginHorizontal: '10%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        fontSize: 20,
        color: '#fff',
    }
});
