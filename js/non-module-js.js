function shareText() {
    var message = document.getElementById("output-message").value; // Récupère le texte à partager

    if (navigator.share) {
        navigator.share({
            text: message
        })
            .then(() => {
                console.log("Partage réussi !");
            })
            .catch((error) => {
                console.error("Erreur lors du partage :", error);
            });
    } else {
        console.log("La fonction de partage n'est pas prise en charge.");
        // Fallback vers une autre méthode d'envoi/partage sur les appareils non compatibles
    }
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}


const TextAllowed = (event) => {
    if (document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on") == true) return true;
    else if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 32) return true;
    else return false;
}
const CopyTxt = (textPlaceId) => {
    if (!textPlaceId) return;
    let text = document.getElementById(textPlaceId).innerHTML;

    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");

    let inputElem = document.createElement('input');
    inputElem.setAttribute('value', text);
    document.body.appendChild(inputElem);
    inputElem.select();

    document.execCommand('copy');

    inputElem.parentNode.removeChild(inputElem);

}

const CopiedBt = (buttonId) => {
    let bt = document.getElementById(buttonId);
    if (!bt.classList.contains('copied-button')) bt.classList.add('copied-button');
    bt.setAttribute('data-i18n', 'reset');

}

const ResetButton = (buttonId) => {

    let bt = document.getElementById(buttonId);
    let p = document.getElementById("initial-hided-container");

    if (!p.classList.contains('hided')) {
        if (bt.classList.contains('copied-button')) bt.classList.remove('copied-button');
        if (bt.classList.contains('output-box-start-style')) bt.classList.remove('output-box-start-style');
         bt.setAttribute('data-i18n', 'reset');
    }

}


function openfile() {
    var fileInput = document.getElementById('file-input');
    fileInput.onchange = function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var text = event.target.result;
            document.getElementById('message').value = text;
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

function saveFile() {
    let text = document.getElementById("output-message").innerHTML;
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
  
    let file = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(file, "result.txt");
  }
  
