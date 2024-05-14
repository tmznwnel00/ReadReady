import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Platform, TouchableOpacity, Button } from 'react-native';
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
    /*
    useEffect(() => {
        fetchReviewsForBook(book.id);
    }, [book.id]);*/

    useEffect(() => {
        const loadUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) setUsername(storedUsername);
        };

        loadUsername();
    }, []);

    const reviewData = [
        { itemId: 253997222, username: 'Mini', rating: 10, date: '2020-10-22', description: '정말 선물받은느낌입니다ㅠㅠ..!' },
        { itemId: 259448673, username: 'User1', rating: 4, description: 'Great book!' },
        { itemId: 259448673, username: 'User2', rating: 5, description: 'Awesome read!' },
    ];
    /*
    
    const fetchReviewsForBook = async (bookId) => {
        // Fetch reviews from backend API
        try {
            const response = await fetch(`http://127.0.0.1:8000/rating/${bookId}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };*/

    const handlePostReview = async () => {/*
        const reviewData = {
            bookId: book.itemId,
            username: username,
            rating: parseInt(rateInput),
            description: reviewInput,
        };
*/
        // Send review data to backend API
        try {
            const response = await fetch('http://127.0.0.1:8000/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });
            const data = await response.json();
            setReviews([...reviews, data]);
            setReviewInput('');
            setRateInput('');
        } catch (error) {
            console.error('Error posting review:', error);
        }
    };
    

    const renderStarRating = (rating) => {
        const fullStars = Math.floor(rating / 2);
        const halfStar = rating % 2 === 1;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        const stars = Array(fullStars).fill('★').join('');
        const halfStarSymbol = halfStar ? '☆' : '';
        const emptyStarsSymbol = Array(emptyStars).fill('☆').join('');

        return stars + halfStarSymbol + emptyStarsSymbol;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                <Text style={styles.title}>Search</Text>
                <View style={styles.inputContainer}>
                    <Icon name="magnify" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder={"도서명 또는 작가"}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                </View>
            <View style={styles.bookList}>
                <View
                    style={styles.bookContainer}> 
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={styles.bookDescription}>{book.description}</Text>
                </View>
            </View>
            <View style={styles.progress}>
                
                <TextInput></TextInput>
                <Text> / </Text>
                <TextInput></TextInput>
                <Text> pages </Text>
            </View>
            <View>
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
                <Button style = {styles.reviewButton} title="Post" onPress={handlePostReview}/>
                </View>
            <View style={styles.reviewList}>
                    {reviewData.map((review, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <Text style={styles.reviewUsername}>{review.username}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                        <Text style={styles.reviewRating}>{renderStarRating(review.rating)}</Text>
                        <Text style={styles.reviewDescription}>{review.description}</Text>
                    </View>
                    ))}
            </View>
            </View>
        </ScrollView>
        <Navbar navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
        justifyContent: 'space-between',
    },
    scrollViewContent: {
        alignItems: 'center', // or any other desired alignment
        justifyContent: 'center', // or any other desired
        minHeight: 800,
        borderWidth: 1,
        borderColor: 'red',
    },
    scrollView: {
        width: '90%',
        marginTop: 10,
        flex: 1,
    },
    bookList:{
        alignItems:'center',
    },
    title: {
        marginTop: '20%', 
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
    },
    icon: {
        fontSize: 30,
        marginLeft: 10,
    },
    inputContainer: {
        marginTop: '10%',
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderRbookius: 10,
        ...Platform.select({
        ios: {
            shbookowColor: 'rgba(0,0,0,0.5)',
            shbookowOffset: { width: 0, height: 2 },
            shbookowOpacity: 0.5,
            shbookowRbookius: 3,
        },
        android: {
            elevation: 5,
        },
        }),
    },
    input: {
        fontFamily: 'BIZUDGothic',
        fontSize:20,
        marginLeft: 15,
        flex: 1,
    },

    bookContainer: {
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Inter-Regular',
        height: 'auto',
        borderTopWidth: 1, 
        borderTopColor: '#ccc',
        
    },
    bookTitle: {
        margin: 10,
        fontSize: 20,
        fontFamily: 'Inter-Regular',
        fontWeight: 600,
    },
    bookAuthor: {
        margin: 5,
        fontSize: 17,
        fontFamily: 'Inter-Regular',
        fontWeight: 600,
    },
    bookDescription: {
        margin: 10,
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        fontWeight: 600,
    },
    rateInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    reviewInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    reviewButton: {
        marginBottom: 10,
    },
    reviewList: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    reviewItem: {
        marginBottom: 20,
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
        marginTop: 5,
    },
});
