
import {
    ShowSalt,
    TextBoxSwap,
    SaltRequired,
    TurnOutputOn,
    BetweenEncAndDec
} from './submenu_tools.js';


// ----------------------------------
// Nav ------------------------------

//-------------------------------------
//Masquer ou afficher la boîte à sel
document.getElementById("saltOn").addEventListener("click", ShowSalt);
document.getElementById("saltOff").addEventListener("click", ShowSalt);
//-------------------------------------

//-------------------------------------
//Changement CSS du chiffreur
document.getElementById("sub-menu-encrypter").addEventListener('click', function () {
    let p = document.getElementById("sub-menu-encrypter");

    if (p.classList.contains("crypter-swap-button-off") == true) {
        p.classList.replace("crypter-swap-button-off", "crypter-swap-button-on");
        document.getElementById("sub-menu-decrypter").classList.replace("crypter-swap-button-on", "crypter-swap-button-off");
    }
});
document.getElementById("sub-menu-encrypter").addEventListener("click", ShowSalt);
document.getElementById("sub-menu-encrypter").addEventListener("click", TextBoxSwap);
//-------------------------------------

//-------------------------------------
//Changement CSS du décrypteur
document.getElementById("sub-menu-decrypter").addEventListener('click', function () {
    let p = document.getElementById("sub-menu-decrypter");

    if (p.classList.contains("crypter-swap-button-off") == true) {
        p.classList.replace("crypter-swap-button-off", "crypter-swap-button-on");
        document.getElementById("sub-menu-encrypter").classList.replace("crypter-swap-button-on", "crypter-swap-button-off");

    }
});
document.getElementById("sub-menu-decrypter").addEventListener("click", ShowSalt);
document.getElementById("sub-menu-decrypter").addEventListener("click", TextBoxSwap);
//-------------------------------------

//-------------------------------------
//Copy button
//document.getElementById("copy-button-output").addEventListener("click", copiedButtonCssChange);
document.getElementById("copy-button-output").addEventListener("click", CopyTxt("copy-button-output"));
//-------------------------------------

//-------------------------------------
//Form submit
document.getElementById("formEnc").addEventListener('submit', function (event) {
    if (document.getElementById("message").value == '') {
        alert("Vous avez oublié d'écrire un message!");
        event.preventDefault();
    }
    else {
        try {
            BetweenEncAndDec();

        }
        catch (err) {
            console.log(err);
            alert("Désolé, une erreur s'est produite. Essayer à nouveau.");
            event.preventDefault();
        }

    }
});

//-------------------------------------
