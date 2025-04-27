// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

////// AYACUCHO ///////////////////////////////////////////////////////////////////////////////////
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const environment = {
  firebase: {
    apiKey: "AIzaSyCd_t-uumyuRFUk5xFM14Iqxmplktoba20",
    authDomain: "ayacucho-550.firebaseapp.com",
    projectId: "ayacucho-550",
    storageBucket: "ayacucho-550.firebasestorage.app",
    messagingSenderId: "70874261780",
    appId: "1:70874261780:web:097d2e055cc9f94e1f7a01",
    measurementId: "G-49L6W8RCD9"
},
      production : false,
      //production : true,
    };
  
  // Initialize Firebase
  const app = initializeApp(environment.firebase);
  const analytics = getAnalytics(app);

////// DEMO ///////////////////////////////////////////////////////////////////////////////////
// Dummypark para devel
/*export const environment = {
  firebase: {
      apiKey: "AIzaSyDyrikGh_AIpTIoIhOaawgGOdk1YrQhSDw",
      authDomain: "dummy-park.firebaseapp.com",
      projectId: "dummy-park",
      storageBucket: "dummy-park.appspot.com",
      messagingSenderId: "942276751616",
      appId: "1:942276751616:web:0ea886d0c7fa880f8583e5"
  },
  production: false,
  
}; */

///////////////////PLAYA SanLuisCba ////////////////////////////////////////////////////////////////////////
// pfpark app database para prod

/*  export const environment = {
   firebase: {
     projectId: 'pfparkapp',
     appId: '1:1004743501223:web:a0ad3783b0075ea8764282',
     storageBucket: 'pfparkapp.appspot.com',
     locationId: 'southamerica-east1',
     apiKey: 'AIzaSyAU7c6aWYQPt4Z-d6fMkK1m-zhFzhVbwbA',
     authDomain: 'pfparkapp.firebaseapp.com',
     messagingSenderId: '1004743501223',
     measurementId: 'G-E9BWNVQKEG',
   },
   production: false,
  
 }; */

///////////////////PLAYA RIVERA CBA  ////////////////////////////////////////////////////////////////////////
// pfpark app database para prod

/*  export const environment = {
   firebase: {
    apiKey: "AIzaSyD81Ze6jBon9RyqHXavLWGHmUYFCOD_XX4",
    authDomain: "rivera-cba.firebaseapp.com",  
    projectId: "rivera-cba",  
    storageBucket: "rivera-cba.appspot.com",  
    messagingSenderId: "699739361796",  
    appId: "1:699739361796:web:510043b9de320da2699b51",  
    measurementId: "G-KC28CREFPY"  
   },
   production: false,
  
 }; */



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
