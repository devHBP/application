import React from 'react';
import Main from './Main';
import {Provider} from 'react-redux';
import store from './store';
import FCMManager from './components/FCMManager';
import { CountdownProvider } from './components/CountdownContext';  


const App = () => {
  return (
    <Provider store={store}>
      <CountdownProvider>
        <FCMManager />
        <Main />
      </CountdownProvider>
    </Provider>
  );
};

export default App;
