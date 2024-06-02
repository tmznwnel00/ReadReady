import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../assets/components/Navbar';

export default function LibraryPage({ navigation }) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const booksJson = await AsyncStorage.getItem('books');
            const books = booksJson ? JSON.parse(booksJson) : [];
            setBooks(books);
        };

        fetchBooks();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.bookItem} onPress={() => navigation.navigate('ProgressPage', { book: item })}>
            <Text style={styles.bookTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.title}>Library</Text>
                <FlatList
                    data={books}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
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
    progressContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 40,
    },
    bookItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    bookTitle: {
        fontSize: 18,
    },
});
