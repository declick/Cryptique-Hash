


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js')
    .then((regi) => {
      // l'enregistrement a fonctionné
      console.log('Enregistrement réussi');
    }).catch((error) => {
      // échec de l'enregistrement
      console.log('Erreur : ' + error);
    });
}


