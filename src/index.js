import './styles.css';
import { 
  hideLoginError, 
  showLoginState, 
  showLoginForm, 
  showApp, 
  showLoginError, 
  btnLogin,
  btnSignup,
  btnLogout,
  txtDate,
  showNodePrompt,
  showNodeError,
  hideNodeError
} from './ui'

import {
  plotFetchedEntriesOnDate
} from './script'

import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  //connectAuthEmulator
} from 'firebase/auth';

import { getDatabase, ref, set, onValue, get, child, query, limitToLast, orderByChild, equalTo } from 'firebase/database';

const firebaseConfig = {
  apiKey: "yourapikey",
  authDomain: "your auth domain",
  databaseURL: "https://your.database.url",
  projectId: "your project id",
  storageBucket: "your storage bucke",
  messagingSenderId: "your message sender id",
  appId: "your app id",
  measurementId: "your measurement id"
};

//You may change the following three default values
var path = "";              //empty database path and waiting for user input
var myDate = "2023-01-01";  //default date
var numOfElts = 200;        //maximum of number data samples to be read

// Login using email/password
const loginEmailPassword = async () => {
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  // step 1: try doing this w/o error handling, and then add try/catch
  //await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  //const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  //console.log(userCredential.user);

  // step 2: add error handling
  try {
     const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
     console.log(userCredential.user);
     //writeUserData("2023-08-23", "1:12:15 PM", "35");
     //fetchChildren('sensor 15');
  } 
   catch(error) {
     console.log(`There was an error: ${error}`);
     showLoginError(error);
   }
}

// Create new account using email/password
const createAccount = async () => {
  const email = txtEmail.value;
  const password = txtPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
  }
  catch(error) {
    console.log(`here was an error: ${error}`);
    showLoginError(error);
  } 
}

// Monitor auth state
const monitorAuthState = async () => {
  const myDate = txtDate.value;

  onAuthStateChanged(auth, user => {
    if (user) {
      //console.log(user);
      showApp();
      showLoginState(user);
      hideLoginError();
      //from script.js: plot using plotly
      let currentDate = new Date().toJSON().slice(0,10);
      console.log(currentDate);
      //window.location.replace("home.html"); //redirect page - still need further research
      plotFetchedEntriesOnDate(db,'node1', currentDate, 200); 
    }
    else {
      showLoginForm();
      lblAuthState.innerHTML = "You're not logged in.";
    }
  })
}

// Log out
const logout = async () => {
  console.log(`log out`);
  await signOut(auth);
}

// monitor the node selection and show error message if the node does not exist and display the plot if data are available
const show = () => {
  const sel = document.getElementById("selection"); // or this if only called onchange
  const value = sel.value; // or value = sel.options[sel.selectedIndex].value
  path = sel.options[sel.selectedIndex].text;  //path in the database
  //console.log(value, path);
  if (value=="0") {
    showNodePrompt();
  }
  else{
    onValue(ref(db, path), (snapshot) => {
      if (snapshot.exists()){
        //console.log("path exist");
        hideNodeError();
        plotFetchedEntriesOnDate(db, path, myDate, numOfElts);
      }
      else{
        //console.log("path does not exist");
        showNodeError();
      }
    });
  }
}

//add event listeners for click on sign in/out buttons
btnLogin.addEventListener("click", loginEmailPassword) 
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

// Initialize Firebase realtime database
const databaseApp = initializeApp(firebaseConfig);
const auth = getAuth(databaseApp);
const db = getDatabase(databaseApp);
//Set auth states persisted in the current session only. Closing the window would clear any existing state even if a user forgets to sign out.
setPersistence(auth, browserSessionPersistence); 

//if Emulator is used
//connectAuthEmulator(auth, "http://localhost:9098");

//mointor Authentication state
monitorAuthState();

//if date changes, update the plots
document.getElementById("txtDate").addEventListener("change",(ev)=>{
  if (ev&&ev.target){
   //if (ev.target.value=="")
   //  ev.target.value = ev.target.dataset.default;
   myDate = ev.target.value;
   console.log(path);
   plotFetchedEntriesOnDate(db, path, myDate, numOfElts);
  }
});


//add event listener if if the 
window.addEventListener("load", () => { // on load 
  document.getElementById("selection").addEventListener("change",show); // show on change
  show(); // show onload
});

