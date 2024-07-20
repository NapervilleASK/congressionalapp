import { StyleSheet, View, Text, Link, Linking} from 'react-native';

export default function Tips() {
  return (
    <View style = {styles.container}>
      <Text style = {styles.header}>404 | Not found</Text>
      <Text style={{color: 'dodgerblue',textAlign:'center',fontSize:20,marginTop:30}}
      onPress={() => Linking.openURL('/',"_self")}> Go to home page? </Text>
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
