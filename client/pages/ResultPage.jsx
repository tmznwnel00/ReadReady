import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../assets/components/Navbar';

export default function ResultPage({ route, navigation }) {
    const [searchQuery, setSearchQuery] = useState(route.params.searchQuery);
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        navigation.navigate('Result', { searchQuery });
    };

    /*
    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                if (response.ok) {
                    setResults(data.books.slice(0, 5));
                } else {
                    console.error('Server error:', data.error);
                    setResults([]);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setResults([]);
            }
        };

        fetchData();
    }, [searchQuery]);
    */
   useEffect(() => {
        const fetchData = async() => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const simulatedResponse = {
                "books": [
                    {
                        "id": "259448673",
                        "title": "해리 포터 영화 속 뜨개질 마법",
                        "author": "타니스 그레이 (지은이), 조진경 (옮긴이)",
                        "description": "타니스 그레이, 세라 엘리자베스 켈너, 다이애나 왈라 등 유명 패턴 디자이너들이 손수 디자인한 마법 세계 패턴들로 가득한 《해리 포터 영화 속 뜨개질 마법》에서는 〈해리 포터〉 시리즈 공식 뜨개질 패턴 28선을 독자들에게 공개한다."
                    },
                    {
                        "id": "210689",
                        "title": "해리 포터와 마법사의 돌 1 (무선)",
                        "author": "J.K. 롤링 (지은이), 김혜원 (옮긴이)",
                        "description": "흥미진진하고 흡인력 있으며 매력적인 독특한 이야기로 책이 출간될 때마다 무단 결석으로 몸살을 앓는 학교, 어른들까지 밤잠을 설치게 하는 해리 포터 시리즈는 27개국 언어로 번역되어 미국 8백만 부, 영국 2백80만 부, 독일 70만부 등 1백 30개국에서 1천만 부 이상 팔려나는 '해리 포터' 선풍을 일으키고 있다."
                    },
                    {
                        "id": "113801533",
                        "title": "파이 미로 - 판타지 수학소설",
                        "author": "김상미 (지은이)",
                        "description": "수학이 <해리 포터>처럼, <반지의 제왕>처럼 판타스틱하고 재미있을 수 있다면! 현직 중학교 수학교사인 저자가 문제 풀이 수학에 지친 아이들에게 수학의 다른 면을 보여주고자 집필한 수학판타지소설."
                    },
                    {
                        "id": "385626",
                        "title": "해리 포터 시리즈 1~4편 세트 - 전10권",
                        "author": "조앤 K. 롤링 (지은이), 김혜원, 최인자 (옮긴이)",
                        "description": "전세계적 초대형 베스트셀러 '해리 포터' 시리즈 4편을 세트로 묶었다. 구성은 1편 '마법사의 돌' 1, 2권, 2편 '비밀의 방' 1, 2권, 3편 '아즈카반의 죄수' 1, 2권, 그리고 4편 '불의 잔' 1, 2, 3, 4권으로 모두 10권이다."
                    },
                    {
                        "id": "22117165",
                        "title": "피터래빗 시리즈 01 : 피터래빗 이야기",
                        "author": "베아트릭스 포터 (지은이), 김동근 (옮긴이)",
                        "description": "베아트릭스 포터 베스트 콜렉션 시리즈 1권. 1902년 영국의 초판 인쇄본을 그대로 재현한 '베아트릭스 포터 콜렉션' 오리지널 에디션이다. 한적한 시골 농장을 무대로 펼쳐지는 토끼 피터래빗의 신나는 모험담이 펼쳐진다."
                    
                    }
                ]
                };
                setResults(simulatedResponse.books);
            };

            fetchData();
        }, [searchQuery]);

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
            <ScrollView style={styles.scrollView}>
            {results.map((book, index) => (
                <View key={index} style={styles.bookContainer}> 
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={styles.bookDescription}>{book.description}</Text>
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
        height: '50%',
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
