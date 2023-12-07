import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import Main from './Main';
import {Provider} from 'react-redux';
import store from './store';
import messaging from '@react-native-firebase/messaging';

const App = () => {


  useEffect(() => {
     if (requestUserPermission()){
      messaging().getToken().then( token => {
        console.log('Token:', token)
      })
     }
     else {
      console.log('Failed token status', authStatus)
     }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Accéder directement à la propriété `body` de l'objet `notification`
      const messageBody = remoteMessage.notification.body;
      Alert.alert(
        'Le Pain du Jour',
        messageBody || 'You received a new message',
      );
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default App;
