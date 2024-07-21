import { StyleSheet, View, Text} from 'react-native';

export default function Tips() {
  return (
    <View>
      <Text style = {styles.header}>Carbon Tips</Text>
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
