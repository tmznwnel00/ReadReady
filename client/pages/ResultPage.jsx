import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';

export default function ResultPage({ route, navigation }) {
    const { searchQuery } = route.params;

    const [ads, setAds] = useState([]);

    useEffect(() => {
        // Simulate fetching ads data
        const fetchedAds = [
            { id: 1, title: "한자 암기박사 4~8급 - 바로바로 외워지는 신기한 암기 공식!", author: "박원길", category: "외국어", imageUrl: "http://www.aladin.co.kr/shop/wproduct.aspx?ItemId=20645716&amp;partner=openAPI&amp;start=api" },
            { id: 2, title: "Explore new reading materials", author: "박원길", category: "외국어", imageUrl: "https://example.com/image2.jpg" },
            // Add more ads as needed
        ];
        setAds(fetchedAds);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>  
                <Text style={styles.title}>Search</Text>
                <View style={styles.inputContainer}>
                    <Icon name="magnify" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="도서명 또는 작가"
                        value={searchQuery}
                        onChangeText={() => {}}
                    />
                </View>
            
            <ScrollView style={styles.scrollView}>
            {ads.map((ad) => (
                <View key={ad.id} style={styles.adContainer}> 
                    <View style={styles.detailContainer}>
                        <Text style={styles.adTitle}>{ad.title}</Text>
                        <Text style={styles.adAuthor}>{ad.author}</Text>
                        <Text style={styles.adCategory}>{ad.category}</Text>
                        <Image
                            source={{ uri: ad.imageUrl }}
                            style={styles.adImage}
                        />
                    </View>
                </View>
            ))}
            </ScrollView>
        </View>
        <Navbar navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    searchContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FEF9F2',
        
    },
    scrollView: {
        width: '90%',
        marginTop: 10,
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
        fontFamily: 'BIZUDGothic',
        fontSize:20,
        marginLeft: 15,
        flex: 1,
    },

    adContainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Inter-Regular',
        height: 150,
        borderTopWidth: 1, 
        borderTopColor: '#ccc',
        
    },
    detailContainer: {
        flex: 1,
        marginTop: 30,
    },
    adImage: {
        width: 100,
        resizeMode: 'contain',
    },
    adTitle: {
        margin: 5,
        width: 150,
        fontSize: 20,
        fontFamily: 'Inter-Regular',
        fontWeight: 600,
    },
    adAuthor: {
        margin: 5,
        width: 150,
        fontSize: 17,
        fontFamily: 'Inter-Regular',
        fontWeight: 600,
    },
    adCategory: {
        margin: 5,
        width: 150,
        fontSize: 17,
        fontFamily: 'Inter-Regular',
        fontWeight: 600,
    },
});
