import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import Context_provider from './context/Context_provider';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Context_provider>
      <App />
    </Context_provider>
  </Provider>
);
