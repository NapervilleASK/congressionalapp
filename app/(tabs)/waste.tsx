import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from 'react-native-simple-bottom-sheet';
export default function Waste() {
  const panelRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  return (
    <>
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{...styles.button,borderTopLeftRadius:10,borderBottomLeftRadius:10}} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera&nbsp;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.button,borderTopRightRadius:10,borderBottomRightRadius:10}} onPress={toggleCameraFacing}>
              <Text style={styles.text}>&nbsp;Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      <BottomSheet isOpen={false}>
        <Text style={styles.header}>How do I use this?</Text> 
        <Text style={styles.paragraph}>{`\nHave you ever had something you wanted to toss, but were unsure of whether it should go in the trash, recycling bin, or compost?\n\nOur waste classification feature uses the power of AI to tell you where it should go! Just snap a picture of the waste to get started.\n\n\n`}</Text>
        <View />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.5)',
    padding:20, 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    fontSize:40,
    color: 'black',
    textAlign: 'center'
  },
  paragraph: {
    fontSize:18,
    color: 'black',
    textAlign: 'center'
  }
});
