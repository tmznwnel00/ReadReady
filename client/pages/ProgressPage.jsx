import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Platform, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProcessPage({ route, navigation }) {
    const [readingList, setReadingList] = useState([]);
    const [currentPage, setCurrentPage] = useState('');
    const [isInReadingList, setIsInReadingList] = useState(false);

    const { book } = route.params || {}; 

    useEffect(() => {
        const fetchReadingList = async () => {

            const list = await AsyncStorage.getItem('readingList');
            const formattedList = list ? JSON.parse(list) : [];
    
            if (book) {
                const bookInList = formattedList.find(item => item.bookId === book.id);
                if (bookInList) {
                    setIsInReadingList(true);
                    setCurrentPage(bookInList.currentPage.toString());
                }
            }
            setReadingList(formattedList);
        };
    
        fetchReadingList();
    }, [book.id]);
    
    const handleCurrentPageChange = (text) => {
        setCurrentPage(text);
    };
    
    const handleSubmit = async () => {
        const updatedList = isInReadingList ?
            readingList.map(item => item.bookId === book.id ? { ...item, currentPage: parseInt(currentPage) } : item) :
            [...readingList, { bookId: book.id, currentPage: parseInt(currentPage) }];
    

            await AsyncStorage.setItem('readingList', JSON.stringify(updatedList))
            .then(() => {
                navigation.navigate('ReadingPage', { updatedList });
            })
            .catch(error => console.error('Failed to save reading list:', error));
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
  
            <TextInput
                style={styles.input}
                placeholder="Current Page"
                value={currentPage}
                onChangeText={handleCurrentPageChange}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
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
        fontFamily: 'BIZUDGothic', 
        alignItems: 'center',
    },
    title: {
        marginTop: '20%', 
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
    },
    input: {
        fontSize: 15,
        fontFamily: 'BIZUDGothic',
        backgroundColor: '#fff',
        marginTop: 150,
    },
    submit: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10, 
        justifyContent: 'center',
        width: '20%',
        height: 50, 
        marginTop: 50,
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'BIZUDGothic',
        
    }
});
