import React from 'react';
import { View, WebView } from 'react-native';
import { FileSystem } from 'expo';

/* html */
import htmlString from './includes/_android.js';

export default class QRdecoder extends React.Component {
  static defaultProps = {
    src: null,
    onSuccess: () => { },
    onError: () => { },
  }

  constructor(props) {
    super(props);

    this.webView = null;
  }

  async componentDidUpdate() {
    let { src } = this.props;

    if (src) {
      if (src.match(/^data:image\/(.+);base64,/)) {
        console.warn('[react-native-qrimage-decoder]:src must be "file://xxxxx" or "http://xxxxx" or "https://xxxxxx" on Android.');
      } else if (src.match(/^https?/)) {
        this.webView.injectJavaScript(`readBySrc("${src}")`);
      } else if (src.match(/^file/)) {
        if (src.indexOf('file') !== -1) {
          src = `${src.split('/').pop(-1)}`;

          await FileSystem.copyAsync({
            from: this.props.src,
            to: `${FileSystem.documentDirectory}${src}`,
          });
        }

        this.webView.injectJavaScript(`readBySrc("${src}")`);
      }
    }
  }

  onMessage = async (e) => {
    const { error, message, src } = JSON.parse(e.nativeEvent.data);

    if (!src.match(/^https?/)) {
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${src}`);
    }

    if (error) {
      this.props.onError(message);
    } else {
      this.props.onSuccess(message);
    }
  }

  render() {
    return (
      <View style={{ display: 'none' }}>
        <WebView
          ref={(ref) => { this.webView = ref; }}
          source={{ html: htmlString, baseUrl: FileSystem.documentDirectory }}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          allowUniversalAccessFromFileURLs
          onMessage={this.onMessage}
        />
      </View>
    );
  }
}
