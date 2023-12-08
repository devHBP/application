import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import Main from './Main';
import { Provider } from 'react-redux';
import store from './store';
import FCMManager from './components/FCMManager';

const App = () => {

  

  return (
    <Provider store={store}>
      <FCMManager />
      <Main />
    </Provider>
  );
};

export default App;
