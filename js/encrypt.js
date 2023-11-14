
import { FindPosition,
    IntArrayToString, 
    LoadData, 
    Print, 
    MakeShufflePositionArr, 
    EncrypLogic, 
    GetRandInt, 
    Average, 
    HashComplex, 
    ConvertCharArrayIntoInt
} from './aux_functions.js';

// Compress: compresse une chaîne de caractères
// Unzip: décompresse une chaîne de caractères
import {Compress, Unzip} from './compress.js';

// Decrypt prend en entrée une chaîne de caractères cryptée, un mot de passe, et un paramètre optionnel "sel".
// Elle utilise un algorithme de décryptage pour transformer la chaîne de caractères cryptée en une chaîne de caractères décompressée, qui correspond au message original.
// La fonction affiche également le message décompressé à l'utilisateur.
const Decrypt = () => {
    
    // LoadData: charge les données d'entrée pour le cryptage ou le décryptage
    let info = new LoadData(false);
    
    info.stringInput = Unzip(info.stringInput);//console.log(info.stringInput);


    //if (info.stringInput[info.stringInput.length - 1] == ' ') info.stringInput = info.stringInput.pop();
    let codeInt = info.stringInput.split(" ");
    //----------------


    let hashKey = [5];
    // HashComplex: calcule un hash à partir d'une chaîne de caractères et d'un nombre complexe
    if (info.salt == "false") for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + z), info.complexNum);
    else for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + info.saltChar + z), info.complexNum);

    let i = 0;
    let j = 0;
    let realLenghtOutput = 0;
    let decryptedMsgArray = [];

    // MakeShufflePositionArr: génère un tableau d'entiers aléatoires pour mélanger les données
    let position = MakeShufflePositionArr(hashKey[2], codeInt.length);


    for (let p = 0; p < codeInt.length; p++) {

        if (j >= hashKey[0].length) {
            j = 0;
            hashKey[0] = HashComplex(hashKey[0], 0);
        }
        // FindPosition: retourne la position d'un élément dans un tableau
        if (codeInt[FindPosition(position, p)] - (hashKey[0].charAt(j)).charCodeAt(0) >= 0) {
            decryptedMsgArray[realLenghtOutput] = Math.floor((codeInt[FindPosition(position, p)] - (hashKey[0].charAt(j)).charCodeAt(0)));
            realLenghtOutput++;
        }
        if (i >= hashKey[1].length) {
            i = 0;
            hashKey[1] = HashComplex(hashKey[1], 0);
            hashKey[3] = HashComplex(hashKey[3], 0);
        }
        if (hashKey[1][i] >= hashKey[3][i]) {
            p++;
        }
        j++;
        i++;
    }
    
    // IntArrayToString: convertit un tableau d'entiers en une chaîne de caractères
    Print("output-label", "Message :", "output-message", IntArrayToString(decryptedMsgArray));

}

// Encrypt prend en entrée une chaîne de caractères à crypter, un mot de passe, et un paramètre optionnel "sel".
// Elle utilise un algorithme de cryptage pour transformer la chaîne de caractères en une autre chaîne, qui est ensuite compressée. La fonction renvoie false.
const Encrypt = () => {

    // LoadData: charge les données d'entrée pour le cryptage ou le décryptage
    let info = new LoadData(true);
    let hashKey = [5];
    // HashComplex: calcule un hash à partir d'une chaîne de caractères et d'un nombre complexe
    if (info.salt == "false") for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + z), info.complexNum);
    else for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + info.saltChar + z), info.complexNum);
    
    // Average: calcule la moyenne d'un tableau d'entiers
    let averageCharacterInInput = Average(ConvertCharArrayIntoInt(info.stringInput));

    let lowRandom = Math.floor(averageCharacterInInput * 0.8);
    let upperRadom = Math.floor(averageCharacterInInput * 1.2);

    //------------
    let y = 0;
    let rInt;
    let i = 0;
    let criptedMsgArr = [];
    Array.from(info.stringInput).forEach(q => {
        // EncrypLogic: effectue la logique de cryptage pour un caractère donné
        criptedMsgArr[y] = EncrypLogic(q, hashKey[0].charAt(i));

        if ((hashKey[1].charAt(i)).charCodeAt(0) >= (hashKey[3].charAt(i)).charCodeAt(0)) {
            //Mettre un nombre aléatoire dans le code //GetRandInt: retourne un entier aléatoire dans une plage donnée
            rInt = GetRandInt(lowRandom, upperRadom);
            y++;
            criptedMsgArr[y] = EncrypLogic(String.fromCharCode(rInt), (hashKey[4].charAt(i)));

        }
        i++;
        y++;
        if (i >= hashKey[0].length) {
            i = 0;

            // HashComplex: calcule un hash à partir d'une chaîne de caractères et d'un nombre complexe
            hashKey[0] = HashComplex(hashKey[0], 0);
            hashKey[1] = HashComplex(hashKey[1], 0);
            hashKey[3] = HashComplex(hashKey[3], 0);
        }
    });
    //----------------------
    // MakeShufflePositionArr: génère un tableau d'entiers aléatoires pour mélanger les données
    let position = MakeShufflePositionArr(hashKey[2], criptedMsgArr.length);
    let auxArray = [criptedMsgArr.length];

    for (let k = 0; k < criptedMsgArr.length; k++) auxArray[k] = criptedMsgArr[position[k]];

    //----------------------
    //console.log(auxArray.join(" "));
    Print("output-label", "Message :", "output-message",  Compress(auxArray.join(" ")));
    Print("output-l-salt", "Sel :", "output-salt", info.saltChar);
    return false;

}

export { Decrypt, Encrypt };
