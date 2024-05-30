import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';

export default function CommunityPage({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (route.params?.newPost) {
      fetchPosts();
    }
  }, [route.params?.newPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/posting');
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const postsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      postsArray.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(postsArray);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Failed to load posts: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Posting')}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>COMMUNITY</Text>
      <ScrollView vertical={true} contentContainerStyle={styles.postsList}>
        {posts.map((post, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('PostDetail', { post })}>
            <View style={styles.postCard}>
              <View style={styles.nameContainer}>
                <Icon name="account-circle" style={styles.profileIcon} />
                <Text style={styles.postUser}>{post.username} 님</Text>
              </View>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{truncateContent(post.content, 20)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Posting')}>
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
    width: '100%',
    flexGrow: 1,
    justifyContent: 'flex-start' ,
    height: 600,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    marginHorizontal: '10%',
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
  postTitle: {
    fontSize: 15,
    marginBottom: 4, 
  },
  postContent: {
    fontSize: 14,
    lineHeight: 30,
  },
  addButton: {
    backgroundColor: '#000',
    marginHorizontal: '10%',
    width: '70%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf:'center',
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
  }
});
