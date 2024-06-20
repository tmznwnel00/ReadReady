import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../assets/components/Navbar';

export default function LibraryPage({ route, navigation }) {
    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/library?username=${storedUsername}`);
                const data = await response.json();
                if (response.ok) {
                    const readingBooks = data.library.filter(book => book.status === 'reading');
                    setBooks(readingBooks);
                } else {
                    console.error('Failed to fetch books:', data.error);
                }
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (route.params?.refresh) {
            fetchBooks();
        }
    }, [route.params?.refresh]);
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.title}>Library</Text>
                <View style={styles.scrollViewContainer}>
                <ScrollView style={styles.scrollViewContent}>
                    {books.map((book, index) => (
                        <View key={index} style={styles.bookCard}>
                            <Text style={styles.bookTitle}>{book.title}</Text>
                            <Text style={styles.bookAuthor}>{book.author}</Text>
                            <Text style={styles.bookProgress}>{book.currentPage}/{book.fullPage}</Text>
                            <TouchableOpacity style={styles.progressButton} onPress={() => navigation.navigate('Progress', { itemId: book.itemId })}>
                                <Text style={styles.progressButtonText}>Update Progress</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                </View>
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
    progressContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 40,
        marginBottom: 20,
        marginTop:'5%',
    },
    scrollViewContainer: {
        alignItems: 'center',
        width: '80%',
    },
    scrollViewContent: {
       
        height: 650,
        width: '100%',
    },
    bookCard: {
        width: '100%',
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontSize: 16,
        color: '#666',
    },
    bookProgress: {
        fontSize: 16,
        color: '#666',
        marginVertical: 10,
    },
    progressButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    progressButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
