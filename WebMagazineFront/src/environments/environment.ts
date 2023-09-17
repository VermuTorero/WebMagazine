import { firebaseConfig } from "./firebaseConfig";
import { provincias } from "./tipos";

export const environment = {
    production: false,
  
    title: `WebMagazine`,
    /* urlAPI: `http://localhost:8080/api`, */
    urlAPI: `https://vermutorero-c484281d5ea5.herokuapp.com/api`,
    /* urlBack: `http://localhost:8080`, */
   urlBack: `https://vermutorero-c484281d5ea5.herokuapp.com`,
    provincias: provincias,
  
  
  // firebase
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
  };