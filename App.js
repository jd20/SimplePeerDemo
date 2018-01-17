/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';

import wrtc from 'react-native-webrtc'

// Uncomment the 2nd import to use the locally patched version of simple-peer
import Peer from 'simple-peer'
//import Peer from './simple-peer'

export default class App extends Component<{}> {
  state = { status: '', message: '' }

  connect = () => {
    this.setState({ status: 'Connecting...' })
    var peer1 = new Peer({ initiator: true, wrtc: wrtc })
    var peer2 = new Peer({ wrtc: wrtc })

    peer1.on('signal', (data) => {
      // when peer1 has signaling data, give it to peer2 somehow
      console.log('Peer1: signal')
      peer2.signal(data)
    })

    peer2.on('signal', (data) => {
      // when peer2 has signaling data, give it to peer1 somehow
      console.log('Peer2: signal')
      this.setState({ status: 'Received signaling data' })
      peer1.signal(data)
    })

    peer1.on('connect', () => {
      // wait for 'connect' event before using the data channel
      console.log('Peer1: connect')
      peer1.send('hey peer2, how is it going?')
    })

    peer2.on('connect', () => {
      console.log('Peer2: connect')
      this.setState({ status: 'Connected' })
    })

    peer2.on('data', (data) => {
      // got a data channel message
      console.log('got a message from peer1: ' + data)
      this.setState({ message: data.toString() })
    })
  }

  render() {
    const { status, message } = this.state

    return (
      <View style={styles.container}>
        <Button title='Connect' onPress={this.connect} />
        <Text style={styles.welcome}>Status:</Text>
        <Text style={styles.instructions}>{status}</Text>
        <Text style={styles.welcome}>Message:</Text>
        <Text style={styles.instructions}>{message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
