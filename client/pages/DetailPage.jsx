import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';

export default function DetailPage({ route, navigation }) {
    const { book } = route.params;
    const [searchQuery, setSearchQuery] = useState(route.params.searchQuery);
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        navigation.navigate('Result', { searchQuery });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>  
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
    searchContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        
    },
    scrollView: {
        width: '90%',
        marginTop: 10,
        flex: 1,
    },
    bookList:{
        height: 600,
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
});
