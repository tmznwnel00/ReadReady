import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../assets/components/Navbar';

export default function ProgressPage({ route, navigation }) {
    const [readingList, setReadingList] = useState([]);
    const [currentPage, setCurrentPage] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const [isInReadingList, setIsInReadingList] = useState(false);

    const { book } = route.params || {};

    useEffect(() => {
        if (book && book.libraryId) {
            fetchLibraryData(book.libraryId);
        }
    }, [book?.libraryId]);

    const fetchLibraryData = async (libraryId) => {
        try {
            const response = await fetch(`http://127.0.0.1/library?libraryId=${libraryId}`);
            const data = await response.json();
            if (data.book) {
                setCurrentPage(data.book.currentPage.toString());
                setTotalPages(data.book.fullPage.toString());
                setIsInReadingList(true);
            }
        } catch (error) {
            console.error('Failed to fetch library data:', error);
        }
    };


    const updateBookProgress = async () => {
        const url = `http://127.0.0.1/library/current_page`;
        const body = {
            libraryId: book.libraryId,
            page: parseInt(currentPage),
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const result = await response.json();
            console.log('Progress updated:', result.message);
        } catch (error) {
            console.error('Failed to update book progress:', error);
        }
    };

    const updateTotalPages = async (totalPages) => {
        const url = `http://127.0.0.1/library/full_page`;
        const body = {
            libraryId: book.libraryId,
            page: parseInt(totalPages),
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const json = await response.json();
            console.log('Total pages updated:', json.message);
        } catch (error) {
            console.error('Error updating total pages:', error);
        }
    };

    const handleCurrentPageChange = (text) => {
        setCurrentPage(text);
        updateBookProgress();
    };

    const handleTotalPagesChange = (text) => {
        setTotalPages(text);
        updateTotalPages(text);
    };

    if (!book) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.error}>Book data is not available.</Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.title}>Progress</Text>
                <View style={styles.pagesContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Page"
                        value={currentPage}
                        onChangeText={handleCurrentPageChange}
                        keyboardType="numeric"
                    />
                    <Text>/</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Total Pages"
                        value={totalPages}
                        onChangeText={handleTotalPagesChange}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.submit} onPress={updateBookProgress}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 120,
    },
    title: {
        marginTop: '20%', 
        fontSize: 40,
    },
    input: {
        fontSize: 15,
        backgroundColor: '#fff',
        padding: 10,
        width: 120, 
        textAlign: 'center',
        marginHorizontal: 30,
    },
    submit: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width: '60%',
        alignSelf: 'center',
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    }
});
