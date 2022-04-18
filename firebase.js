import {initializeApp}from'firebase/app'
import {getFirestore}from 'firebase/firestore'
import{getStorage}from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyA2Oyn_zTzMXDA3f92-qqSnuHJ_atiyb1s",
    authDomain: "insta-clone-fa1bc.firebaseapp.com",
    projectId: "insta-clone-fa1bc",
    storageBucket: "insta-clone-fa1bc.appspot.com",
    messagingSenderId: "1076452674990",
    appId: "1:1076452674990:web:b248df7d46cf9f62fc0c3f",
    measurementId: "G-8K85BWHG2Y"
  };
  const app=initializeApp(firebaseConfig)
  const db= getFirestore(app);
  const storage=getStorage(app)
  export {db,storage};