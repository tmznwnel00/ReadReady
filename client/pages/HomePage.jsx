import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import Navbar from '../assets/components/Navbar';

export default function HomePage({ navigation }) {
    // Dummy data for the recommendations section
    const recommendations = [
        { title: "Book Title 1", author: "Author 1", rating: "★★★★☆" },
        { title: "Book Title 2", author: "Author 2", rating: "★★★★★" },
        { title: "Book Title 3", author: "Author 2", rating: "★★★☆☆" },
        // Add more books as needed
    ];

    return (
        <SafeAreaView style={styles.container}>

        <View style={styles.content}>
            <Text style={styles.title}>Read, Ready?</Text>
            
    
            <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>Recommendation</Text>
                <ScrollView vertical={true} style={styles.recommendationsScrollView}>
                    {recommendations.map((book, index) => (
                        <View key={index} style={styles.bookCard}>
                            {/* <Image source={require('../assets/book_cover_placeholder.png')} style={styles.bookCover} /> */}
                            
                            <Text style={styles.bookTitle}>{book.title}</Text>
                            <Text style={styles.bookAuthor}>{book.author}</Text>
                            <Text style={styles.bookRating}>{book.rating}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.bookShelfContainer}>
                <Text style={styles.bookshelf}>Jiyun's Bookshelf</Text>
                </View>
            </View>

            
        </View>
        <Navbar navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Content starts from the top
    },
    title: {
        fontSize: 50,
        fontFamily: 'Bokor-Regular',
        marginTop: '10%',
    },
    bookShelfContainer: {
        backgroundColor: '#2F2F2F',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        width: '80%',
        alignItems: 'center',
        position: 'absolute',
        top: '-10%',

    },
    bookshelf: {
        fontSize: 17,
        color: '#fff',
        fontFamily: 'BIZUDGothic',
    },
    recommendationSection: {
        marginTop: '15%',
        width: '80%',
        height: '65%',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20, 
        elevation: 5, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recommendationTitle: {
        fontSize: 23,
        fontFamily: 'BlackHanSans-Regular',
        marginVertical: 15,
       
    },
    recommendationsScrollView: {
        width: '100%',
    },
    bookCard: {
        backgroundColor: '#2F2F2F',
        borderRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        height: 130,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 20,
        alignItems:'center',
        justifyContent: 'center',
        
    },
    bookCover: {
        width: 130, 
        height: 180, 
        resizeMode: 'contain',
        marginBottom: 10, 
    },
    bookTitle: {
        color: '#fff',
        fontSize: 20,
        lineHeight: 50,
        fontFamily: 'Bokor-Regular',
        marginTop: -10,
    },
    bookAuthor: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 30,
        fontFamily: 'Bokor-Regular'
    },
    bookRating: {
        color: '#fff',
        fontSize: 20,
    },
});
