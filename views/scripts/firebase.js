var app_firebase={};
(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC5AbL6FrZgz9Tib8hv7bt1Avhk1Gmeldo",
    authDomain: "ando-1e52b.firebaseapp.com",
    databaseURL: "https://ando-1e52b.firebaseio.com",
    projectId: "ando-1e52b",
    storageBucket: "ando-1e52b.appspot.com",
    messagingSenderId: "546720580730"
  };
  firebase.initializeApp(config);

  app_firebase = firebase;
})()