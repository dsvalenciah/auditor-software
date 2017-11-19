import * as firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDc6Gy0dfk1EYIroZDut19LqQtA1J3fUM8",
  authDomain: "auditoria-e8b99.firebaseapp.com",
  databaseURL: "https://auditoria-e8b99.firebaseio.com",
  projectId: "auditoria-e8b99",
  storageBucket: "auditoria-e8b99.appspot.com",
  messagingSenderId: "555225710531"
};

class FirebaseService {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.database = firebase.database();
    this.storage = firebase.storage();
  }

  getUser(then){
    firebase.auth().onAuthStateChanged(user => {then(user);});
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log("LogIn"))
    .catch(error => console.log('Error ' + error.code + ': ' + error.message));
  }

  handleLogout() {
    firebase.auth().signOut()
    .then(result => console.log("LogOut"))
    .catch(error => console.log('Error ' + error.code + ': ' + error.message));
  }

  /* Getters */
  getUserRecords(userUid, then) {
    this.database.ref().child('records').child(userUid).on(
      'value', (snapshot) => {then(snapshot.val())}
    );
  }

  getQuestionsPerArea(then) {
    this.database.ref().child('cartilla').on(
      'value', (snapshot) => {then(snapshot.val())}
    );
  }

  /* Modifiers */
  modifyUserRecord(userUid, recordUid, record) {
    this.database.ref(
      'records/' + userUid + '/' + recordUid + '/'
    ).update(record);
  }

  /* Setters */
  setUserRecord(userUid, recordUid, record) {
    this.database.ref(
      'records/' + userUid + '/' + recordUid + '/'
    ).set(record);
  }

  setUserRecordFile(userUid, recordUid, question, file) {
    this.storage.ref(
      'files/' + userUid + '/' + recordUid + '/' + question + '/' + file.name
    ).put(file);
  }

  /* Removers */
  deleteUserRecord(userUid, recordUid) {
    this.database.ref(
      'records/' + userUid + '/' + recordUid + '/'
    ).remove();
  }
}

export default FirebaseService;