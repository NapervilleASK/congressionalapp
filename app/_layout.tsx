import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Image, Text, View   } from 'react-native';
import { PaperProvider } from 'react-native-paper';
function LogoTitle() {
  return (
    <View style = {{flexDirection:'row',alignItems:'center'}}>
      <Image
        style={{ width: 50, height: 50 }}
        source={require('@/assets/images/leaves.png')}
      />
      <Text style={{color:'white'}}>EcoSense</Text>
    </View>
  );
}
export default function RootLayout() {
  return (
    <PaperProvider>
    <ThemeProvider value={DarkTheme}>
      <Stack>
        {/*@ts-ignore*/}
        <Stack.Screen name="(back)" options={{ headerTitleAlign: 'center',headerTitle: (props) => <LogoTitle {...props} /> }} />
        {/*@ts-ignore*/}
        <Stack.Screen name="article" options={{ headerTitleAlign: 'center', headerTitle: (props) => <LogoTitle {...props} /> }}/>
        {/*@ts-ignore*/}
        <Stack.Screen name="+not-found" options={{ headerTitleAlign: 'center',headerTitle: (props) => <LogoTitle {...props} /> }}/>
      </Stack>
      
    </ThemeProvider>   
    </PaperProvider>       
  );
}
