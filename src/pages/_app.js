import store from "@/services/store";
import React from 'react';
// import { Provider } from 'react-redux';
import '@/styles/globals.css'

const App = ({ Component, pageProps }) => {
  return (
    // <Provider store={store}>
    <Component {...pageProps} />
    // </Provider>
  );
};

export default App;