import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Image, Animated } from 'react-native'
import React, { useState, useRef } from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router' 

const index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password)
            if (user) router.replace('/(back)');
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message);
        }
    }

    const signUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password)
            if (user) router.replace('/(back)');
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message);
        }
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
        
    React.useEffect(() => {
        Animated.parallel([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
            toValue: 0,
            speed: 12,
            bounciness: 8,
            useNativeDriver: true,
        }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Welcome to EcoSense!</Text>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={require('@/assets/images/leaves.png')}
                />
                <TextInput style={styles.textInput} placeholder="email" value={email} onChangeText={setEmail} />
                <TextInput style={styles.textInput} placeholder="password" value={password} onChangeText={setPassword} secureTextEntry/>
                <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={styles.text}>Make Account</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Animated.View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#4CAF50', // A green color for eco theme
    },
    textInput: {
      width: '100%',
      backgroundColor: '#1E1E1E',
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      color: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#4CAF50',
    },
    button: {
      width: '100%',
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      marginBottom: 15,
    },
    text: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
});