/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AlertIOS,
  PushNotificationIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = ReactNative;

var Button = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
        underlayColor={'white'}
        style={styles.button}
        onPress={this.props.onPress}>
        <Text style={styles.buttonLabel}>
          {this.props.label}
        </Text>
      </TouchableHighlight>
    );
  }
});

class NotificationExample extends React.Component {
  componentWillMount() {
    // Add listener for push notifications
    PushNotificationIOS.addEventListener('notification', this._onNotification);
    // Add listener for local notifications
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
  }

  componentWillUnmount() {
    // Remove listener for push notifications
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
    // Remove listener for local notifications
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }

  render() {
    return (
      <View>
        <Button
          onPress={this._sendNotification}
          label="Send fake notification"
        />

        <Button
          onPress={this._sendLocalNotification}
          label="Send fake local notification"
        />
      </View>
    );
  }

  _sendNotification() {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }

  _sendLocalNotification() {
    require('RCTDeviceEventEmitter').emit('localNotificationReceived', {
      aps: {
        alert: 'Sample local notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }

  _onNotification(notification) {
    AlertIOS.alert(
      'Push Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onLocalNotification(notification){
    AlertIOS.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }
}

class NotificationPermissionExample extends React.Component {
  state: any;

  constructor(props) {
    super(props);
    this.state = {permissions: null};
  }

  render() {
    return (
      <View>
        <Button
          onPress={this._showPermissions.bind(this)}
          label="Show enabled permissions"
        />
        <Text>
          {JSON.stringify(this.state.permissions)}
        </Text>
      </View>
    );
  }

  _showPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      this.setState({permissions});
    });
  }
}

var styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'blue',
  },
});

exports.title = 'PushNotificationIOS';
exports.description = 'Apple PushNotification and badge value';
exports.examples = [
{
  title: 'Badge Number',
  render(): ReactElement<any> {
    PushNotificationIOS.requestPermissions();

    return (
      <View>
        <Button
          onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(42)}
          label="Set app's icon badge to 42"
        />
        <Button
          onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(0)}
          label="Clear app's icon badge"
        />
      </View>
    );
  },
},
{
  title: 'Push Notifications',
  render(): ReactElement<any> {
    return <NotificationExample />;
  }
},
{
  title: 'Notifications Permissions',
  render(): ReactElement<any> {
    return <NotificationPermissionExample />;
  }
}];
