// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAmq8e1CtC2PaFQVIx3YN0UB15FG7yhlpo',
  authDomain: 'chuong-thong-minh-v1.firebaseapp.com',
  projectId: 'chuong-thong-minh-v1',
  messagingSenderId: '445984597810',
  appId: '1:445984597810:web:472c9fec3121a26845592b'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
