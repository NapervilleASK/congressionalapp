import { StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { auth } from '@/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';

export default function Index() {

  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/');
  })

  return (
    <View style={styles.container}>
      <Text style = {styles.header}>Welcome to EcoSense!</Text>
      <Image
        style={{ width: 200, height: 200 }}
        source={require('@/assets/images/leaves.png')}
      />
      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text style={styles.text}>Sign Out</Text>
      </TouchableOpacity>
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
  titleContainer: {
    backgroundColor:'#121212',
  },
  header: {
    color:'white',
    fontSize: 50,
    textAlign:'center',
    marginTop:60,
  },
  title: {
    color:'white',
    fontSize: 25,
    textAlign:'center',
    marginTop:60
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

});
