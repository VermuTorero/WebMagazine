import { firebaseConfig } from "./firebaseConfig";
import { provincias } from "./tipos";

export const environment = {
    production: false,
  
    title: `WebMagazine`,
    /* urlAPI: `http://localhost:8080/api`, */
    urlAPI: `https://vermutoreroapp.herokuapp.com/api`, 
    /* urlBack: `http://localhost:8080`, */
    urlBack: `https://vermutoreroapp.herokuapp.com`,
    provincias: provincias,


        
  // firebase
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  databaseURL: firebaseConfig.databaseURL,
  };