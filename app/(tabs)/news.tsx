import { StyleSheet, View, Text} from 'react-native';

export default function News() {
  return (
    <View>
      <Text style = {styles.header}>Environmental News</Text>
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
