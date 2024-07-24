import { StyleSheet, View, Text} from 'react-native';

export default function Index() {
  return (
    <View>
      <Text style = {styles.header}>About Us</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor:'#121212',
  },
  header: {
    color:'white',
    fontSize: 50,
    textAlign:'center',
    marginTop:60
  }
});
