# react-native-qrimage-decoder
QR image decoder libraries require linking...  
So this library does not require linking.  
But now still require Expo on Android.  
I will response as soon as possible not require Expo on Android.

## Instration
```bash
npm install react-native-qrimage-decoder --save
```

## Usage
```js
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  WebView,
} from 'react-native';
import { ImagePicker, Constants, FileSystem } from 'expo';

import QRdecoder from 'react-native-qrimage-decoder';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: Constants.manifest.primaryColor,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      src: null,
    };
  }

  onPressPath = async (e) => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      });

      this.setState({
        src: image.uri,
      });
    } catch (err) {
      console.log(err);
    }
  }

  onPressBase64 = async (e) => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });

      if (image.uri.lastIndexOf('.') > 0) {
        let mimetype;
        const ext = image.uri.substr(image.uri.lastIndexOf('.')).toLowerCase();

        if (ext === '.jpg' || ext === '.jpeg' || ext === '.jpe') {
          mimetype = 'image/jpeg';
        } else if (ext === '.png') {
          mimetype = 'image/png';
        } else if (ext === '.gif') {
          mimetype = 'image/gif';
        }

        if (mimetype) {
          this.setState({
            src: `data:${mimetype};base64,${image.base64}`,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  onSuccess = (data) => {
    Alert.alert('成功', data);
  }

  onError = (data) => {
    Alert.alert('エラー', data);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.onPressPath}>
          <Text style={styles.buttonText}>画像を選択{'\n'}return image uri(path)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.onPressBase64}>
          <Text style={styles.buttonText}>画像を選択{'\n'}return image base64</Text>
        </TouchableOpacity>
        <QRdecoder src={this.state.src} onSuccess={this.onSuccess} onError={this.onError} />
      </View>
    );
  }
}
```
Checkout [example](example).

## QRdecoder API
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| src | string | null | Image path(file:///xxxxxx or https://xxxxx or http://xxxxx) or `data:${mimetype};base64,${image.base64}` |
| onSuccess | func | (data) => {} | Called when qr decode success. | 
| onError | func | (data) => {} | Called when qr decode error. | 
  
onError, return data(string) is below.  
* QR code not found : `error decoding QR Code`
* Image load failed : `Failed to load the image`

**Note : dataURL suppoert is iOS only.**