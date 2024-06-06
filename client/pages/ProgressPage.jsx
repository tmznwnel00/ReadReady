import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper'; // Import ProgressBar
import Navbar from '../assets/components/Navbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon from vector icons

export default function ProgressPage({ route, navigation }) {
    const { itemId } = route.params;
    const [currentPage, setCurrentPage] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const [username, setUsername] = useState('');
    const [libraryId, setLibraryId] = useState(null);

    useEffect(() => {
        const loadUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername.trim());
            }
        };

        loadUsername();

        const fetchLibraryData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/library?username=${username}`);
                const data = await response.json();
                if (response.ok) {
                    const book = data.library.find(item => item.itemId === itemId);
                    if (book) {
                        setCurrentPage(book.currentPage.toString());
                        setTotalPages(book.fullPage.toString());
                        setLibraryId(book.libraryId);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (username) {
            fetchLibraryData();
        }
    }, [username, itemId]);

    const handleCurrentPageChange = (text) => {
        setCurrentPage(text);
    };

    const handleTotalPagesChange = (text) => {
        setTotalPages(text);
    };

    const updateBookProgress = async () => {
        if (!username || !itemId) {
            alert('Username and Item ID are required');
            return;
        }

        try {
            if (libraryId) {
                // Update existing library entry
                const response1 = await fetch('http://127.0.0.1:8000/library/current_page', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        libraryId: libraryId,
                        page: parseInt(currentPage),
                    }),
                });

                if (!response1.ok) {
                    throw new Error('Failed to update current page');
                }

                const response2 = await fetch('http://127.0.0.1:8000/library/full_page', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        libraryId: libraryId,
                        page: parseInt(totalPages),
                    }),
                });

                if (!response2.ok) {
                    throw new Error('Failed to update total pages');
                }

                const responseData1 = await response1.json();
                const responseData2 = await response2.json();

                if (responseData1.message === 'Book finished and removed from library') {
                    alert('Book finished and removed from library');
                } else {
                    alert('Progress updated successfully!');
                }
            } else {
                // Create new library entry
                const createResponse = await fetch('http://127.0.0.1:8000/library', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        itemId: itemId,
                        currentPage: parseInt(currentPage),
                        fullPage: parseInt(totalPages),
                    }),
                });

                if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    throw new Error(errorData.error || 'Failed to create library entry');
                }

                alert('Library entry created and progress updated successfully!');
            }

            // Navigate back to the Library page and reload it
            navigation.navigate('Library', { refresh: true });
        } catch (error) {
            console.error(error);
            alert('Failed to update progress.');
        }
    };

    const progress = totalPages ? (currentPage / totalPages) : 0;
    const progressPercentage = Math.round(progress * 100);

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
                <View style={styles.progressBarContainer}>
                    <ProgressBar 
                        progress={progress} 
                        color="#000"
                        style={styles.progressBar} 
                    />
                    <Text style={styles.progressText}>{progressPercentage}%</Text>
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
        alignItems: 'center',
        flex: 1,
        marginTop: 20,
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
    progressBarContainer: {
        width: '80%',
        alignItems: 'center',
        marginTop: 100,
        position: 'relative',
    },
    progressBar: {
        width: '100%',
        height: 30,
    },
    progressText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginTop: -10,
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
