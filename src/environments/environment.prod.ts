export const environment = {
  production: true,
  baseURL: 'https://vok-lagyo-didi.herokuapp.com',
  firebaseConfig: {
    apiKey: "AIzaSyChZ1XaMsH0PAQEmdv-tHAGF4zdOEsU9lU",
    authDomain: "bhok-lagyo.firebaseapp.com",
    projectId: "bhok-lagyo",
    storageBucket: "bhok-lagyo.appspot.com",
    messagingSenderId: "885703448681",
    appId: "1:885703448681:web:ce675f7ad7352d755c6af8",
    measurementId: "G-LFNXFCMLL0"
  },
  message: {
    collection: "message-thread",
    subCollection: "messages",
    threads: {
      all: "all$public"
    },
  }
};
