import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example using MaterialCommunityIcons
import Navbar from '../assets/components/Navbar';

export default function CommunityPage({ navigation }) {
    const posts = [
        { user: "s.r.eun", content: "주식 투자 책 추천해주세요.\n최대한 단기간 내 고수익을 냈으면 합니다!\n..." },
        { user: "j2_y00n", content: "최근 심금을 울린 소설을 읽었습니다.\n바로 그 소설은 \n..." },
        { user: "이영지", content: "목 건강을 위해서 가져야할 습관 5가지!\n1. 겨울철 목도리 꼭 하고 다니기\n2. ..." },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>COMMUNITY</Text>
            <ScrollView vertical={true} style={styles.postsList}>
                {posts.map((post, index) => (
                    <View key={index} style={styles.postCard}>
                        <View style={styles.nameContainer}>
                            <Icon name="account-circle" style={styles.profileIcon}/>
                            <Text style={styles.postUser}>{post.user} 님</Text>
                        </View>
                        <Text style={styles.postContent}>{post.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <Navbar navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F2',
        alignItems: 'stretch',  // Changed from 'center' to 'stretch' to allow full width
    },
    title: {
        marginTop: '20%', 
        marginBottom: 30,
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
        alignSelf: 'center', // Ensure title is centered without affecting other components
    },
    postsList: {
        width: '100%', // Ensures the list takes up full width
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        marginVertical: 15,
        marginHorizontal: '10%', // Maintains horizontal spacing
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nameContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 20, 
    },
    profileIcon: {
        fontSize: 30,
        color: '#556080', 
        marginRight: 8, 
    },
    postUser: {
        fontSize: 18,
        marginBottom: 4, 
    },
    postContent: {
        fontSize: 14,
        lineHeight: 30,
    },
});
