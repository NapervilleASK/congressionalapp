import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Image, Animated, Platform} from 'react-native'
import React, { useState, useRef } from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { router } from 'expo-router' 

import { Dialog, Portal, Button, Paragraph } from 'react-native-paper';
const index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const hideDialog = () => setVisible(false);

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/(back)');
        } catch (error: any) {
            console.log(error);

            setErrorMessage('Sign in failed: ' + error.message);
            setVisible(true);
        }
    }

    const signUp = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Sign up failed: passwords do not match.');
            setVisible(true);
            return;
        }

        if (firstName == ""  || lastName == ""){
            setErrorMessage('Sign up failed: please set a name.');
            setVisible(true);
            return;
        }
        

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user) {
                await updateProfile(user, {
                    displayName: `${firstName} ${lastName}`,
                });
                router.replace('/(back)');
            }
        } catch (error: any) {
            console.log(error);
            setErrorMessage('Sign up failed: ' + error.message);
            setVisible(true);
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
                <Portal>
                    <Dialog
                    visible={visible}
                    onDismiss={hideDialog}
                    style={{ backgroundColor: '#1a1a1a' }}
                    >
                    <Dialog.Title style={{ color: '#00ff00', fontSize: 24, fontWeight: 'bold' }}>
                        Error
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{ color: '#ffffff', fontSize: 18, lineHeight: 24 }}>
                        {errorMessage}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button 
                        onPress={hideDialog} 
                        textColor="#00ff00"
                        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                        >
                        OK
                        </Button>
                    </Dialog.Actions>
                    </Dialog>
                </Portal>

                {!showLogin && !showSignup && (
                    <>
                        <TouchableOpacity style={styles.button} onPress={() => setShowLogin(true)}>
                            <Text style={styles.text}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setShowSignup(true)}>
                            <Text style={styles.text}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )}

                {showLogin && (
                    <>
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Email" 
                            value={email} 
                            onChangeText={setEmail} 
                        />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Password" 
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button} onPress={signIn}>
                            <Text style={styles.text}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => setShowLogin(false)}>
                            <Text style={styles.text}>Back</Text>
                        </TouchableOpacity>
                    </>
                )}

                {showSignup && (
                    <>
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="First Name" 
                            value={firstName} 
                            onChangeText={setFirstName} 
                        />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChangeText={setLastName} 
                        />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Email" 
                            value={email} 
                            onChangeText={setEmail} 
                        />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Password" 
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry
                        />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChangeText={setConfirmPassword} 
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button} onPress={signUp}>
                            <Text style={styles.text}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => setShowSignup(false)}>
                            <Text style={styles.text}>Back</Text>
                        </TouchableOpacity>
                    </>
                )}
            </SafeAreaView>
        </Animated.View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
      width: Platform.select({web: '60%', default:'80%'}),
      alignSelf:'center',     
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
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
