// Entorno de PRODUCCION - PF Park App (Playa San Luis CBA)
// alias "prod" en .firebaserc -> proyecto pfparkapp
// Se activa con: ng build --configuration=pfparkapp



export const environment = {
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
  production: true,
};

