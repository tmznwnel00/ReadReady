import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReadingPage = ({ route, navigation }) => {
    const { updatedList } = route.params;

    return (
        <View style={styles.container}>
            {updatedList.map(item => (
                <Text key={item.bookId} style={styles.item}>
                    Book ID: {item.bookId}, Current Page: {item.currentPage}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        marginVertical: 10,
    }
});

export default ReadingPage;
