import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { auth } from '@/FirebaseConfig'; // Ensure this is correctly configured
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        router.replace('/');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to EcoSense!</Text>
        <Image
          style={{ width: 200, height: 200 }}
          source={require('@/assets/images/leaves.png')}
        />
        <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.attribution}>
          Icons Designed By Pixellez from pngtree.com
        </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 50,
    textAlign: 'center',
    marginTop: 60,
  },
  button: {
    width: '60%',
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
  attribution: {
    position: 'absolute', // Positioning it at the bottom right
    bottom: 20,
    right: 20,
    color: 'gray',
    fontSize: 12,
    textAlign: 'right',
  },
});
