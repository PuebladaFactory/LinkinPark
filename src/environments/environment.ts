// Entorno de DESARROLLO LOCAL (alias "dev" en .firebaserc -> proyecto dummy-park)
// `ng serve` usa este archivo tal cual.
// `ng build --configuration=pfparkapp` o `--configuration=rivera-cba` lo reemplazan
// (ver "fileReplacements" en angular.json).


export const environment = {
  firebase: {
    apiKey: "AIzaSyDyrikGh_AIpTIoIhOaawgGOdk1YrQhSDw",
    authDomain: "dummy-park.firebaseapp.com",
    projectId: "dummy-park",
    storageBucket: "dummy-park.appspot.com",
    messagingSenderId: "942276751616",
    appId: "1:942276751616:web:0ea886d0c7fa880f8583e5"
  },
  production: false,
};
