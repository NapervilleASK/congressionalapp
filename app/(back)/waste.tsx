  import { CameraView, useCameraPermissions } from 'expo-camera';
  import { useState, useRef } from 'react';
  import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
  import { readAsStringAsync, EncodingType } from 'expo-file-system';
  //@ts-ignore
  import BottomSheet from 'react-native-simple-bottom-sheet';
  import { Modal, Portal, Text, Button, ActivityIndicator, MD2Colors } from 'react-native-paper';   


  export default function Waste() {
    const [visible, setVisible] = useState(false);
    const [lVisible, lSetVisible] = useState(false);
    const [recyclable, setRecyclable] = useState(null);
    const [type, setType] = useState('');
    const [info, setInfo] = useState('');
    const ref = useRef(null);
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    const takePicture = async () => {
      lSetVisible(true);
      //@ts-ignore
      const photo = await ref.current.takePictureAsync({quality:0.5 ,skipProcessing:true});
      let parsed;
      
      if (!photo.hasOwnProperty("base64"))
        //@ts-ignore
        parsed = await readAsStringAsync(photo.uri, { encoding: EncodingType.Base64 });
      else
        parsed = photo.base64;
        try {
          const response = await fetch('https://congressionalappserver.vercel.app/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: parsed
          }); 
          const data = await response.text()
          console.log(data)
          //@ts-ignore
          const { recyclable, type, info } = JSON.parse(data) ;
          setRecyclable(recyclable);
          setType(type);
          setInfo(info);
          lSetVisible(false);
          setVisible(true);
        } catch (error) {
          console.error('Error sending image to server:', error);
        }
    };

    if (!permission) {
      return <View />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission}> Grant Permission </Button>
        </View>
      );
    }

    function toggleCameraFacing() {
      setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
      <>
        <Portal>
          <Modal
            visible={lVisible}
            onDismiss={() =>lSetVisible(false)}
            contentContainerStyle={{
              backgroundColor: '#121212',
              padding: 20,
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
            }}
          >
            <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={()=>setVisible(false)}
            contentContainerStyle={{
              backgroundColor: '#121212',
              padding: 20,
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
            }}
          >
            <ScrollView>
              {recyclable !== null && (
                <>
                  <Text style={{ ...styles.text, color: '#90EE90', fontSize: 40 }}>
                  {`Success!\n\n`}
                  </Text>
                  <Text style={styles.infoText}>
                    {type   }
                  </Text>
                  <Text style={{ ...styles.infoText, color: recyclable ? 'green' : 'red' }}>
                    {recyclable ? 'recyclable' : 'not recyclable'} {'\n\n\n'}
                  </Text>
                  <Text style={styles.infoText}>
                    {info} {'\n\n\n'}
                  </Text>
                </>
              )}
              <Button
                onPress={()=>{setVisible(false)}}
                theme={{ colors: { primary: 'white' } }}
                mode="contained"
              >
                Close!
              </Button>
            </ScrollView>
          </Modal>
        </Portal>
        <View style={styles.container}>
          {/*@ts-ignore */}
          <CameraView style={styles.camera} facing={facing} ref={ref}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{ ...styles.button, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Flip Camera&nbsp;</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                onPress={takePicture}
              >
                <Text style={styles.text}>&nbsp;Take Picture</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
        <BottomSheet isOpen={false}>
          <Text style={styles.header}>How do I use this?</Text>
          <Text style={styles.paragraph}>
            {`\nHave you ever had something you wanted to toss, but were unsure of whether it should go in the trash, recycling bin, or compost?\n\n Our waste classification feature uses the power of AI to tell you where it should go! Just snap a picture of the waste to get started.\n\n\n`}
          </Text>
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
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 10,
    },
      button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        marginBottom:60,
        height:'12%'
      },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    infoText: {
      fontSize: 23,
      color: 'white',
      textAlign: 'center',
    },
    header: {
      fontSize: 40,
      color: 'black',
      textAlign: 'center',
    },
    paragraph: {
      fontSize: 18,
      color: 'black',
      textAlign: 'center',
    },
  });
