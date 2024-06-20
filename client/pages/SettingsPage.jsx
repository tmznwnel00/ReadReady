import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Navbar from '../assets/components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';


export default function SettingsPage({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailNotification, setEmailNotification] = useState('daily');
    const [preferredCategory, setPreferredCategory] = useState('살림');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            setUsername(storedUsername);

            // Fetch user data based on stored username
            const userDataResponse = await fetch(`http://127.0.0.1:8000/user/data?username=${storedUsername}`);
            const userData = await userDataResponse.json();
            if (userData) {
                setEmailNotification(userData.period);
                setPreferredCategory(userData.category);
            }
        };

        fetchUsername();
    }, []);

    const handleSaveChanges = async () => {
        try {
            if (newPassword !== confirmPassword) {
                alert('Error', 'New password and confirm password do not match');
                return;
            }

            if (currentPassword && newPassword) {
                await fetch('http://127.0.0.1:8000/user/password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        new_password: newPassword,
                        confirm_password: confirmPassword
                    })
                });
            }

            await fetch('http://127.0.0.1:8000/user/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, category: preferredCategory })
            });

            await fetch('http://127.0.0.1:8000/user/period', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, period: emailNotification })
            });

            alert('Changes saved successfully');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error', 'Failed to save changes');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Analysis</Text>
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
                        {[
                            "살림", "음식", "가족&결혼", "패션&뷰티", "건강/취미/스포츠", "경제경영",
                            "고전", "과학", "공학", "농업", "동식물", "수학", "의학", "만화", "사회과학",
                            "외국문학작품", "한국문학작품", "문학잡지", "문학이론", "수험서/자격증",
                            "어린이 이과", "어린이 문과", "어린이 동화/명작/고전", "어린이 문화&예술&인물",
                            "어린이 일반", "어린이 언어", "에세이", "여행", "역사", "예술/대중문화", "영어",
                            "일본어", "중국어", "한자", "국어", "기타외국어", "번역/통역", "유아",
                            "인문학 일반", "철학", "신화", "종교", "심리학", "자기계발", "잡지/전집",
                            "자녀교육", "청소년", "컴퓨터/모바일"
                        ].map((category) => (
                            <Picker.Item label={category} value={category} key={category} />
                        ))}
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
        marginBottom: 40,
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
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
})