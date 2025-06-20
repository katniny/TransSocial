// this contains the firebase config and initializes firebase
// before pushing to git, always make sure the firebase config doesn't expose your keys
const firebaseConfig = {
   apiKey: "REPLACE",
   authDomain: "REPLACE",
   databaseURL: "REPLACE",
   projectId: "REPLACE",
   storageBucket: "REPLACE",
   messagingSenderId: "REPLACE",
   appId: "REPLACE"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();
const storageRef = storage.ref();
const timestamp = firebase.database.ServerValue.TIMESTAMP