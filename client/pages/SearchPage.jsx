import React, {useState} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function SearchPage({ navigation }) {

    return (
    <View style={styles.searchContainer}>
        <Text style={styles.title}>SEARCH</Text>
        <View style={styles.inputContainer}>
            <Icon name="magnify" style={styles.icon}/>
            <TextInput
                style={styles.input}
                placeholder="도서명 또는 작가"
                //value={word}
                //onChangeText={searchWord}
            />
        </View>
        
    </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FEF9F2',
        
    },
    title: {
        marginTop:'30%',
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
        borderRadius: 5,
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
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 30,
        width: '30%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'BIZUDGothic',
    },
});
/* <TouchableOpacity
            style={styles.button}>
            <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity> */