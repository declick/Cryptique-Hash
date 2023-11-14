const translations = {
    en: {
        chiffrement: "ENCRYPTION",
        dechiffrement: "DECRYPTION",
        sel:"Salt ? :",
        oui:"Yes",
        non:"No",
        vider:"Clear",
        submit:"Submit",
        titre: "Encrypt and decrypt :",
        crypter: "Encrypt and decrypt your text",
        sha512: "Use SHA512 encryption",
        partage: "Share encrypted text",
        data: "No data stored!",
        reset:"Copy",
        footer:"BUT WHO IS THE FOOL WHO DID THIS FOR THAT?",
        pw: 'Password ...',
        DECRYPTED_MESSAGE_LABEL:"The hidden message:",
        ENCRYPTED_MESSAGE_LABEL: "Encrypted Message:",
        sel: "Salt:"
    },
    fr: {
        chiffrement: "CHIFFREMENT",
        dechiffrement: "DECHIFFREMENT",
        sel:"Du sel ? :",
        oui:"Oui",
        non:"Non",
        vider:"Vider",
        submit:"Soumettre",
        titre:"Chiffrer et déchiffrer :",
        crypter:"Chiffrer et déchiffrer votre texte",
        sha512:"Utilise le chiffrement SHA512",
        partage:"Partager du texte chiffré",
        data:"Aucune données stockées !",
        reset:"Copier",
        footer:"MAIS QUI EST DONC LE CRÉTIN QUI A FAIT ÇA POUR ÇA ?",
        pw: 'Mot de passe ...',
        DECRYPTED_MESSAGE_LABEL:"Le message caché :",
        ENCRYPTED_MESSAGE_LABEL: "Message chiffré :",
        sel: "Voilà ton Sel :"
    }
};

const langButtons = document.querySelectorAll('.lang-button');
let currentLang = 'en'; // Par défaut en anglais
langButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log('Button clicked:', this.id);
        const lang = this.id === 'fr-flag' ? 'fr' : 'en';
        console.log('Selected language:', lang);
        translatePage(lang);
    });
});


function translatePage(lang) {
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

}

