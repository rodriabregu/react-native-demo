import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import apple from './assets/apple.jpg';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadAnonymousAsync from 'anonymous-files';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openImgenPickerAsync = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required :(')
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled) {
      return;
    }

    if(Platform.OS === 'windows') {
      const remoteUri = await uploadAnonymousAsync(pickerResult.uri);
      setSelectedImage({localUri: pickerResult.uri, remoteUri})
    } else {
      setSelectedImage({ localUri: pickerResult.uri })
    }
  }

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The images is available for sharing at: ${selectedImage.remoteUri}`)
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an image!</Text>
      {selectedImage ?
        <TouchableOpacity
          style={styles.button}
          onPress={openShareDialog}>
          <Text style={styles.buttonText}>Share!</Text>
        </TouchableOpacity>
        : <View />
      }
      <TouchableOpacity
        onPress={openImgenPickerAsync}
      >
        <Image
          source={{
            uri: selectedImage !== null
              ? selectedImage.localUri
              : 'https://picsum.photos/seed/picsum/200/200'
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      <Image
        source={apple}
        style={styles.image}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#292929'
  },
  title: {
    fontSize: 40,
    color: '#fffacd',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 2,
    resizeMode: 'contain'
  },
  button: {
    backgroundColor: '#fffacd',
    borderRadius: 2,
    margin: 4,
    padding: 4
  },
  buttonText: {
    color: 'darkslategrey',
    fontSize: 25
  }
})

export default App
