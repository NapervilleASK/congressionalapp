import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Image, Text, View } from 'react-native';
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
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerTitleAlign: 'center',headerTitle: (props) => <LogoTitle {...props} /> }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
