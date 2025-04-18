import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_8XRPoekDK',
  client_id: '67lneqqnjupnq9220a09hc622m',
  redirect_uri: 'https://master.d2avvftcrnwudn.amplifyapp.com', // Or your localhost:3000 for development
  response_type: 'code', // Authorization Code Flow
  scope: 'openid email phone',
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
     <App />
  </Provider>
);

// root.render(
//   <React.StrictMode>
//     <AuthProvider {...cognitoAuthConfig}>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </AuthProvider>
//   </React.StrictMode>
// );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
