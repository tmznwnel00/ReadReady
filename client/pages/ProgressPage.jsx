import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Platform, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProcessPage({ route, navigation }) {
    const [readingList, setReadingList] = useState([]);
    const [currentPage, setCurrentPage] = useState('');
    const [isInReadingList, setIsInReadingList] = useState(false);
    useEffect(() => {
        const fetchReadingList = async () => {

            const list = await AsyncStorage.getItem('readingList');
            const formattedList = list ? JSON.parse(list) : [];
    
            // Check if the current book is in the reading list
            const bookInList = formattedList.find(item => item.bookId === book.itemId);
            if (bookInList) {
                setIsInReadingList(true);
                setCurrentPage(bookInList.currentPage.toString()); // Ensure currentPage is a string if needed
            }
    
            setReadingList(formattedList);
        };
    
        fetchReadingList();
    }, [book.itemId]);
    
    const handleCurrentPageChange = (text) => {
        setCurrentPage(text);
    };
    
    const handleSubmit = () => {
        const updatedList = isInReadingList ?
            readingList.map(item => item.bookId === book.itemId ? { ...item, currentPage: parseInt(currentPage) } : item) :
            [...readingList, { bookId: book.itemId, currentPage: parseInt(currentPage) }];
    
        // Save the updated list back to storage
        AsyncStorage.setItem('readingList', JSON.stringify(updatedList))
            .then(() => {
                navigation.navigate('ReadingPage', { updatedList });
            })
            .catch(error => console.error('Failed to save reading list:', error));
    };
    

    
    return (
        <SafeAreaView style={styles.container}>
            <View>
            <TextInput
                style={styles.input}
                placeholder="Current Page"
                value={currentPage}
                onChangeText={handleCurrentPageChange}
                keyboardType="numeric"
            />
            <Button
                title="Submit"
                onPress={handleSubmit}
            />
        </View>
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
