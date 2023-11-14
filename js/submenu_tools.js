import { Decrypt, Encrypt } from './encrypt.js';
import { HashComplex } from './aux_functions.js';


// cette fonction est appelée lorsqu'un utilisateur clique sur un bouton pour passer du mode de chiffrement au mode de déchiffrement (ou vice versa).
// Elle gère l'affichage d'une boîte de saisie de "sel" qui est utilisée pour améliorer la sécurité du chiffrement.
// Si le mode est de chiffrement ou si l'utilisateur a sélectionné l'option de ne pas utiliser de sel, la boîte de saisie est désactivée.
const ShowSalt = () => {
    //true = dans le décrypteur (boîte à sel juste nécessaire dans le décrypteur)
    //false = dans le chiffreur
    let saltToDec = document.getElementById("saltDec");

    if (
        document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on") == true
        ||
        document.querySelector('input[name="salt"]:checked').value == "false"
    ) {

        saltToDec.disabled = true;
        saltToDec.classList.replace("saltShowed", "saltNotShowed");
    }
    else {
        saltToDec.disabled = false;
        SaltRequired();
        saltToDec.classList.replace("saltNotShowed", "saltShowed");
    }
}

// cette fonction est appelée pour modifier le texte d'un libellé en fonction du mode de chiffrement/déchiffrement.
//  Si le mode est de chiffrement, le texte est modifié pour indiquer qu'un message doit être saisi, tandis que s'il est de déchiffrement, le texte est modifié pour indiquer qu'un code doit être saisi.
const TextBoxSwap = () => {
    let msgLabel = document.getElementById("message-label");
    let msgInput = document.getElementById("message");

    let inEncrypterOrDecrypter = document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on");

    msgInput.value = '';

}

// cette fonction est appelée pour activer/désactiver la boîte de saisie de "sel" en fonction des choix de l'utilisateur.
// Si l'utilisateur a choisi d'utiliser un sel, la boîte est activée et marquée comme obligatoire, sinon elle est désactivée et marquée comme facultative.
const SaltRequired = () => {
    let salt = document.querySelector('input[name="salt"]:checked').value;
    let saltToDec = document.getElementById("saltDec");
    if (salt == "true") {
        saltToDec.disabled = false;
        saltToDec.setAttribute('required', '');
    }
    else {
        saltToDec.disabled = true;
        saltToDec.removeAttribute('required');
    }
    if (document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-off") == true) saltToDec.removeAttribute('required');
}

// cette fonction est appelée lorsque les résultats du chiffrement/déchiffrement doivent être affichés.
// Elle active les éléments HTML qui affichent les résultats, ainsi qu'un bouton pour copier les résultats dans le presse-papiers.
const TurnOutputOn = () => {
    let outputSalt = document.getElementById("output-salt");

    outputSalt.classList.add("output-after-submit-style");
    outputSalt.disabled = false;

    document.getElementById("output-message").classList.add("output-after-submit-style");
    document.getElementById("output-message").disabled = false;

    let copyOutp = document.getElementById("copy-button-output");
    copyOutp.classList.add("output-after-submit-style");
    copyOutp.disabled = false;

    let copySalt = document.getElementById("copy-button-salt");
    copySalt.classList.add("output-after-submit-style");
    copySalt.disabled = false;

    let lSalt = document.getElementById("output-l-salt");
    lSalt.classList.add("output-after-submit-style");
    lSalt.disabled = false;

    let q = document.getElementById("output-salt-container");
    q.classList.add("output-after-submit-style");
    q.classList.add("output-conteiner");
    q.disabled = false;

    let c = document.getElementById("initial-hided-container");
    c.classList.replace("hided", "not-hided");
}

// cette fonction est appelée lorsque l'utilisateur clique sur le bouton pour chiffrer/déchiffrer un message. 
// Elle appelle les fonctions Encrypt() ou Decrypt(), en fonction du mode actuel, et active les éléments HTML pour afficher les résultats.
const BetweenEncAndDec = () => {

    if (ConfirmTime() == false) return;
    else {
        TurnOutputOn(); //Affiche la barre de progression avant d'appeler SetLoadTime() et Encrypt()/Decrypt()
        if (document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on") == true) Encrypt();
        else Decrypt();
        return false;
    }
}

const TimeToEnd = () => {
    const complexity = 1; // Complexité fixée à 1
    const quantity = 3;

    let high = 0;
    for (let i = 0; i < quantity; i++) {
        const avrgS = performance.now();
        HashComplex("timeCounter", complexity);
        const avrgE = performance.now();
        if (avrgE - avrgS > high) high = avrgE - avrgS;
      
    }

    let probTimeOut = 5 * (10 ** (complexity - 3)) * high;
    probTimeOut /= 1000;
  
    return probTimeOut;
}

// cette fonction est appelée pour demander à l'utilisateur s'il souhaite continuer si le temps estimé est supérieur à un certain seuil.
// Elle utilise les fonctions TimeToEnd() et Checker() pour déterminer le temps approximatif et demander à l'utilisateur s'il souhaite continuer.
const ConfirmTime = () => {
    let time = TimeToEnd();
    let secInMin = 60;
    let secInHour = 3600;
    let secInDay = 86400;

    if (time >= 1) {
        if (time < secInMin) {
            return Checker(time, " second(s)");
        }
        else if (time >= secInMin && time < secInHour) {
            time /= secInMin;
            return Checker(time, " minute(s)");
        }
        else if (time >= secInHour && time < secInDay) {
            time /= secInHour;
            return Checker(time, " hour(s)");
        }
        else {
            time /= secInDay;
            return Checker(time, " day(s)");
        }
    }
}

export {
    ShowSalt,
    TextBoxSwap,
    SaltRequired,
    TurnOutputOn,
    BetweenEncAndDec
};
