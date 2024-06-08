import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Picker, SafeAreaView, ScrollView } from 'react-native';
import Navbar from '../assets/components/Navbar';

export default function ProfilePage({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailNotification, setEmailNotification] = useState('daily');
    const [preferredCategory, setPreferredCategory] = useState('fiction');

    const handleSaveChanges = () => {
        // Placeholder for save changes functionality
        console.log('Changes saved');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>User Profile</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Email Notification Period</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={emailNotification}
                            style={styles.picker}
                            onValueChange={(itemValue) => setEmailNotification(itemValue)}
                        >
                            <Picker.Item label="Daily" value="daily" />
                            <Picker.Item label="Weekly" value="weekly" />
                            <Picker.Item label="Monthly" value="monthly" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferred Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={preferredCategory}
                            style={styles.picker}
                            onValueChange={(itemValue) => setPreferredCategory(itemValue)}
                        >
                            <Picker.Item label="Fiction" value="fiction" />
                            <Picker.Item label="Non-Fiction" value="non-fiction" />
                            <Picker.Item label="Science" value="science" />
                            <Picker.Item label="History" value="history" />
                            <Picker.Item label="Biography" value="biography" />
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
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
        padding: 20,
        height: 800,
    },
    title: {
        marginTop: '20%', 
        marginBottom: '20%',
        fontSize: 40,
        fontFamily: 'BIZUDGothic', 
        alignSelf: 'center', 
    },
    section: {
        marginBottom: 50,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'BIZUDGothic', 
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
