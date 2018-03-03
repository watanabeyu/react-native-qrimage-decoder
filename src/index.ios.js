import React from 'react';
import { View, WebView } from 'react-native';

/* node_modules */
import axios from 'axios';
import { Buffer } from 'buffer/';

/* include html */
const html = require('./includes/ios.html');

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
    if (this.props.src) {
      if (this.props.src.match(/^data:image\/(.+);base64,/)) {
        this.webView.injectJavaScript(`readByDataURL("${this.props.src}")`);
      } else if (this.props.src.match(/^(file|https?):\/\/.+$/)) {
        const response = await axios.get(this.props.src, { responseType: 'arraybuffer' });
        const image = Buffer.from(response.data).toString('base64');
        const buf = `data:${response.headers['content-type'].toLowerCase()};base64,${image}`;
        this.webView.injectJavaScript(`readByDataURL("${buf}")`);
      }
    }
  }

  onMessage = (e) => {
    const { error, message } = JSON.parse(e.nativeEvent.data);

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
          source={html}
          javaScriptEnabled
          onMessage={this.onMessage}
        />
      </View>
    );
  }
}
