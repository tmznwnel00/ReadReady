import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Platform, TouchableOpacity, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailPage({ route, navigation }) {
  const { book } = route.params;
  const [searchQuery, setSearchQuery] = useState(route.params.searchQuery);
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState('');
  const [rateInput, setRateInput] = useState('');
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    navigation.navigate('Result', { searchQuery });
  };

  useEffect(() => {
    console.log('Book object:', book); // Debugging
    console.log('Book cover URL:', book.cover); // Debugging
    fetchReviewsForBook(book.id);
  }, [book.id]);
  

  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) setUsername(storedUsername);
    };

    loadUsername();
  }, []);

  const fetchReviewsForBook = async (bookId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/rating?bookId=${bookId}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching reviews:', errorText);
        throw new Error(`Error fetching reviews: ${errorText}`);
      }
      const data = await response.json();
      console.log('Reviews received:', data);
      setReviews(data.map(review => ({
        ...review,
        date: new Date(review.date * 1000).toLocaleDateString(),
        ratingText: renderStarRating(review.rating)
      })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  

  const handlePostReview = async () => {
    const ratingInt = parseInt(rateInput);  // Ensure rating is an integer
    if (isNaN(ratingInt)) {
      console.error('Invalid rating value:', rateInput);
      return;  // Exit if the rating is not a valid number
    }
  
    const reviewData = {
      itemId: book.id,
      username: username,
      rating: ratingInt,
      description: reviewInput.trim(),  // Trim to remove any extra whitespace
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        const data = await response.json();
        setReviews([...reviews, data]);
        setReviewInput('');
        setRateInput('');
      } else {
        throw new Error(`Failed to post review: ${await response.text()}`);
      }
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };
  
  const renderStarRating = (rating) => {
    if (typeof rating !== 'number' || isNaN(rating)) return 'Rating unavailable';  // Handle non-number ratings
  
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 === 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      Array(fullStars).fill('★').join('') +
      (halfStar ? '☆' : '') +
      Array(emptyStars).fill('☆').join('')
    );
  };
  

  return  (
    <SafeAreaView style={styles.container}>
      
        <View style={styles.searchContainer}>
          <Text style={styles.title}>Search</Text>
          <View style={styles.inputContainer}>
            <Icon name="magnify" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="도서명 또는 작가"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => navigation.navigate('Result', { searchQuery })}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.bookContainer}>
          <Image source={{ uri: book.cover }} style={styles.bookCover} />
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          <Text style={styles.bookDescription}>{book.description}</Text>
        </View>
        <TouchableOpacity style={styles.progress} onPress={() => navigation.navigate('Progress', { book })}>
          <Text style={styles.progressText}>Progress</Text>
        </TouchableOpacity>

        <View style={styles.reviewContainer}>
          <Text style={styles.textReview}>Review</Text>
          <TextInput
            style={styles.rateInput}
            placeholder="Rate"
            keyboardType="numeric"
            value={rateInput}
            onChangeText={setRateInput}
          />
          <TextInput
            style={styles.reviewInput}
            placeholder="Your review"
            multiline
            value={reviewInput}
            onChangeText={setReviewInput}
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePostReview}>
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewList}>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewUsername}>{review.username}</Text>
              <Text style={styles.reviewDate}>{new Date(review.date * 1000).toLocaleDateString()}</Text>
              <Text style={styles.reviewRating}>{renderStarRating(review.rating)}</Text>
              <Text style={styles.reviewDescription}>{review.description}</Text>
            </View>
          ))}
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
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 600,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 80,
    fontSize: 40,
    fontFamily: 'BIZUDGothic',
  },
  icon: {
    fontSize: 30,
    marginLeft: 10,
  },
  inputContainer: {
    marginTop: 50,
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  input: {
    fontSize: 20,
    marginLeft: 15,
    flex: 1,
  },
  bookContainer: {
    width: '90%',
    height: 400,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
  },
  bookCover: {
    width: 180,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  bookAuthor: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5, 
  },
  bookDescription: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom:30,
  },
  textReview: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  rateInput: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  reviewInput: {
    width: '80%', 
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  reviewList: {
    width: '90%', 
    alignSelf: 'center',
    marginBottom: 50, 
    height: 200,
  },
  reviewItem: {
    marginBottom: 30,
    height: 'auto',
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewRating: {
    fontSize: 18,
    marginTop: 5,
  },
  reviewDescription: {
    fontSize: 15,
    marginTop: 5,
  },
  progress: {
    width: '50%',
    height: 40, 
    backgroundColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  progressText: {
    color: '#FFF',
    fontFamily: 'BlackAndWhite',
    fontSize: 20,
  },
  postButton: {
    width:'20%',
    height: 40, 
    backgroundColor: '#000',
    borderRadius:5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postText: {
    color:'#fff',
    fontSize:20,
  }
});
