/*
* CONSIDÉRATIONS INITIALES ET COMMENT UTILISER
* ---------------------------
* Fonctions principales : Compress() et Unzip()
* Ce que fait ce code : il va compresser une séquence de nombres juste divisée (séparée) par des espaces (ascII = 32).
* Peut voir les informations de compression écrites sous cette forme : Compress("your_squence", {showInfo = true})
* Utilisez des exemples (l'entrée est une chaîne, pas un nombre) :
* Compresser("123 124 210 220") -> Valide
* Compresser ("87 95 1 1213148 111") -> Valide
* Compresser("96 97 98 99 100 101", {showInfo = true}) -> Valide
* Compresser("123 456 789", {showInfo = true}) -> Invalide
* Compresser(123) -> Invalide
* Compresser("123.123.431.4213") -> Invalide
*
* Cette compresse a été conçue pour recevoir en entrée des blocs de nombres de taille 2 ou 3, exemple : "123 85 92 133 232". Mais peut être
* utilisé avec n'importe quelle taille de nombre.
* La plage du taux de compression sera normalement comprise entre 47 % et 76 %.
* Le taux de compression attendu pour une séquence de taille de 2 ou 3 chiffres est compris entre 45 % et 55 %, mais dans les meilleurs décors, il peut atteindre près de 33 %.
* Le taux moyen par rapport aux autres séquences de taille de nombre (hors 2 et 3) est de 68 %.
* ---------------------------
*/

/* COMMENT LE CODE FONCTIONNE ET LA LOGIQUE DERRIÈRE ELLE
* ---------------------------
* Tout d'abord, ce code fonctionne avec l'abstraction. Alors, gardez à l'esprit que quelque chose qui est fait a une signification derrière
* qui peut être difficile à percevoir. Connaître la table AscII aidera à comprendre ce qui se passe avec ce
* compresser et peut être considéré comme un must dans la compréhension de celui-ci.
* En bref, on peut dire que compresser la recherche de doublons et de trios qui correspondent à une référence de table et les convertir ensuite en
* un seul caractère ascII. Ainsi, par exemple (n'est-ce pas la bonne correspondance de table), peut compresser la séquence "10" en "a" (50 %
*taux) ou "95_" à "B" (taux de 33%).
* Les doublons correspondants sont définis par le nombre qui apparaît dans la séquence d'entrée qui peut constituer le nombre majeur de doublons dans
* proportion des autres. Ce numéro est appelé "numéro principal". Il sera utilisé pour décompresser le message.
* S'il n'y a pas de correspondance possible et s'il s'agit d'un nombre (ou n'est pas un espace) ne sera pas compressé, il sera imprimé avec le même caractère
* - exemple : un "9" sans correspondance sera imprimé comme un "9". Mais s'il n'y a pas de correspondance avec un espace, sera recherché un
* index non utilisé dans la table et imprimer cet index AscII de la table insère un espace (ne compressera rien, mais cela rend
* n'est pas des espaces dans la sortie compressée - dans certains cas, les espaces peuvent être un problème).
* ....

EXAMPLE:
1) Input: "102 120 123" (length = 11)
2) Trouver le numéro principal: 1
3) Trouvez les duples, les trios ou les "no match": 10 / 2_ / 12 / 0_ / 12 / 3
4) Mappez les doubles ou les trios à l'index de table correspondant: 10 = 0 / 2_ = 62 / 12 = 2 / 0_ = 60 / 12 = 2 / 3 = "no match"
5) Transformer l'index de table en contenu de table respectif: table[0] / table[62] / table[2] /table[60] /table[2] / '3'.charCodeAt(0)
6) Convertir en caractères ASCII: ASCII( table[0] ) / ASCII( table[62] ) / ASCII( table[2] ) / ASCII( table[60] ) / ASCII( table[2] ) / ASCII( '3'.charCodeAt(0) )
7) Créer le message compressé: "!v%t%3" -> output.length = 6 (54% of input length)
8) Contactez le message compressé avec le numéro principal dans le formulaire (mainN + output): "1!v%t%3"
* ---------------------------

REPRÉSENTATION DES ABSTRACTIONS DE TABLE

Sequence        Table Index   Sum
==============================
mainNumber n      00..09     (10)
mainNumber+1 n    10..19     (20)
mainNumber-1 n    20..29     (30)
------------------------------
9/8 n space       30..49     (50)
------------------------------
n space           50..59     (60)
space n           60..69     (70)

---------------------------
-> TABLE LEGEND:
- Séquence = l'ordre possible des caractères pouvant apparaître dans la séquence de saisie
- Table Index = la position dans le tableau de la table à laquelle la séquence respective sera référencée
- mainNumber = le numéro de la séquence qui fait le plus de doublons dans le tableau
- n = any number
*/


//==========================================
//              MAIN FUNCTIONS              
//==========================================

const Compress = (sequenceS, { showInfo = false } = {}) => {
  //Pour voir les informations de compression, écrivez: Compress("your_sequence", {showInfo = true})

  let mainNumber = FindMostUsedTuples(sequenceS);

  const zeroAscII = '0'.charCodeAt(0);

  let output = [];
  let aux = [];
  let y = 0;
  output[y++] = (zeroAscII + mainNumber);

  for (let i = 0; i < sequenceS.length; i++) {
    if ((i + 2) < sequenceS.length && IsNineOrEight(sequenceS, i)) {
      output[y++] = table[(9 - parseInt(sequenceS[i])) * 10 + parseInt(sequenceS[i + 1]) + 30];
      i += 2;

    }
    else if (i + 1 < sequenceS.length) {
      aux = FindDupleMatch(sequenceS, i, mainNumber);
      output[y++] = aux[0];
      i = i + aux[1];
    }
    else {
      output[y++] = NoTuples(sequenceS[i]);
    }
  }
  let result = ReplaceSpaces(output);


  if (showInfo == true) console.log("Input length: " + sequenceS.length
    + " | Output length: " + result.length
    + " | Compress rate: " + (result.length / sequenceS.length));

  return ArrToString(result);
};


const Unzip = (stringIn) => {
  const zeroAscII = '0'.charCodeAt(0);
  let mainNumber, space;

  if (stringIn[0].charCodeAt(0) >= zeroAscII && stringIn[0].charCodeAt(0) <= (zeroAscII + 9)) {
    mainNumber = stringIn[0];
    space = ' '.charCodeAt(0);
  }
  else {
    mainNumber = stringIn[1];
    space = stringIn[0].charCodeAt(0);
  }

  let output = [];
  let index = 0;
  let charCode;
  let positionInTable;
  let startsRange;

  for (let i = ((space == ' '.charCodeAt(0)) ? 1 : 2); i < stringIn.length; i++) {
    charCode = stringIn.charCodeAt(i);
    positionInTable = FindPosition(charCode);
    startsRange = FindStartsRange(charCode, space);
    switch (true) {
      case (startsRange == 0):
        output[index++] = UnzipDuple(mainNumber, charCode);
        break;
      case (startsRange == 30):
        if (positionInTable < 40) {
          output[index++] = '9' + String.fromCharCode((positionInTable - 30) + zeroAscII) + ' ';
        }
        else {
          output[index++] = '8' + String.fromCharCode((positionInTable - 40) + zeroAscII) + ' ';
        }
        break;
      case (startsRange == 50):
        if (positionInTable < 60) {
          output[index++] = ' ' + String.fromCharCode((positionInTable - 50) + zeroAscII);
        }
        else {
          output[index++] = String.fromCharCode((positionInTable - 60) + zeroAscII) + ' ';
        }
        break;
      default:
        output[index++] = ((charCode == space) ? (' ') : (String.fromCharCode(charCode)));
        break;
    }
  }
  return output.join('');
};

//==========================================
//==========================================


//==========================================
//              AUX. FUNCTIONS              
//==========================================

const FindPosition = (number) => {
  let i = 0;
  while (number != table[i] && i < table.length - 1) i++;
  return i;
}

const FindStartsRange = (charCode, space) => {
  /*
  REPRÉSENTATION DES ABSTRACTIONS DE TABLE

  Sequence        Table_Index   Sum       range   start
  ======================================================
  mainNumber n      00..09     (10)    
  mainNumber+1 n    10..19     (20)      [00..29]   00  
  mainNumber-1 n    20..29     (30)    
  ------------------------------------------------------
  9/8 n space       30..49     (50)      [30..49]   30
  ------------------------------------------------------
  n space           50..59     (60)      [50..69]   50
  space n           60..69     (70)    
  
  */
  let outOfRange = table.length + 1;

  if (charCode == space || (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0))) return outOfRange;
  let charPositionInTable = FindPosition(charCode);
  switch (true) {
    case (charPositionInTable >= 0 && charPositionInTable <= 29):
      return 0;
      break;
    case (charPositionInTable >= 30 && charPositionInTable <= 49):
      return 30;
      break;
    case (charPositionInTable >= 50 && charPositionInTable <= 69):
      return 50;
      break;
    default:
      return outOfRange;
      break;
  }
}


const UnzipDuple = (mainNumber, charCode) => {
  const aux = FindPosition(charCode);
  let output;
  switch (true) {
    case (aux >= 0 && aux <= 9):
      output = String.fromCharCode(parseInt(mainNumber) + 48) + String.fromCharCode(aux + 48);
      break;
    case (aux >= 10 && aux <= 19):
      output = ((mainNumber == 9) ? (String.fromCharCode(48))
        : (String.fromCharCode(parseInt(mainNumber) + 1 + 48))
      )
        + String.fromCharCode(aux - 10 + 48);
      break;
    case (aux >= 20 && aux <= 29):
      output = ((mainNumber == 0) ? (String.fromCharCode(57))
        : (String.fromCharCode(parseInt(mainNumber) - 1 + 48))
      )
        + String.fromCharCode(aux - 20 + 48);
      break;
    default:
      break;
  }
  return output;
}



const ArrToString = (arr) => {
  let output = [];

  for (let j = 0; j < arr.length; j++) {
    output[j] = String.fromCharCode(arr[j]);
  }

  return (output.join(''));
}



const NoTuples = (e) => {
  const zeroAscII = '0'.charCodeAt(0);
  return ((e == ' ') ?
    ((' '.charCodeAt(0)))
    :
    (zeroAscII + parseInt(e))
  );

}
const MakeDuple = (e, nextE, mainNumber) => {
  let output = table[
    (parseInt(MakeDupleAux(e, mainNumber))) * 10
    + parseInt(nextE)
  ];
  return output;
}

const IsNineOrEight = (sequenceS, positionInStr) => {
  if ((parseInt(sequenceS[positionInStr]) == 9 || parseInt(sequenceS[positionInStr]) == 8) && sequenceS[positionInStr + 2] == ' ')
    return true;
  else return false;
}

const FindDupleMatch = (sequenceS, i, mainNumber) => {
  let output = [2];
  if (IsDupleMatch(sequenceS[i], mainNumber) && sequenceS[i + 1] != ' ') {
    output[0] = MakeDuple(sequenceS[i], sequenceS[i + 1], mainNumber);
    output[1] = 1;
  }
  else if (sequenceS[i] == ' ' || sequenceS[i + 1] == ' ') {
    if (IsDupleMatch(sequenceS[i + 1], mainNumber)
      || IsNineOrEight(sequenceS, i + 1)) {
      output[0] = NoTuples(sequenceS[i]);
      output[1] = 0;
    }
    else {

      output[0] = MakeDupleWithSpace(sequenceS[i], sequenceS[i + 1]);
      output[1] = 1;
    }
  }
  else {
    output[0] = NoTuples(sequenceS[i]);
    output[1] = 0;
  }
  return output;
}

const MakeDupleWithSpace = (e, nextE) => {
  return (table[50 + ((e == ' ') ?
    parseInt(nextE)
    :
    (parseInt(e) + 10))]);
}

const IsDupleMatch = (intC, mainNumber) => {
  let intI = parseInt(intC);
  if (intI == mainNumber) return true;
  else return ((mainNumber == 0) ?
    ((intI == 9 || intI == 1) ?
      true : false)
    :
    ((mainNumber == 9) ?
      ((intI == 0 || intI == 8) ?
        true : false)

      :
      ((intI == mainNumber + 1 || intI == mainNumber - 1) ?

        true : false)
    ));
}

const MakeDupleAux = (intC, mainNumber) => {
  let intI = parseInt(intC);
  if (intI == mainNumber) return 0;
  else return ((mainNumber == 0) ?
    ((intI == 9) ? (2) : (1))
    :
    ((mainNumber == 9) ?
      ((intI == 0) ? (1) : (2))
      :
      ((intI == (mainNumber + 1)) ? 1 : 2)
    ));

}

const FindMostUsedTuples = (integerS) => {
  let arr = integerS.split(" ");
  let f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // = [0,1,2... 9]
  let aux;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length - 1; j++) {
      f[parseInt(arr[i][j].charAt(0))]++;
    }
  }

  for (let i = 0; i < z.length; i++) {

    if (i == 0 || i == (z.length - 1)) z[i] = f[i] + (i == 0 ?
      (f[i + 1] + f[z.length - 1])
      :
      (f[i - 1] + f[0]));
    else z[i] = f[i] + f[i + 1] + f[i - 1];
  }

  let p = 0;
  let q = 0;
  while (p < 10) {
    for (let i = 0; i < z.length; i++) {
      if (z[q] >= z[i]) p++;
    }
    if (p != 10) {
      p = 0;
      q++;
    }
  }
  aux = q;
  return aux;

}

const ReplaceSpaces = (arr) => {
  let aux = [...table];
  let j;
  let q;
  let CopyArr = [...arr];

  if (arr.length > 10) {
    let spacePos = [];
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == ' '.charCodeAt(0)) spacePos[index++] = i;
    }
    if (index > 0) {
      j = 0;
      while (j < aux.length) {
        q = 0;
        while (q < arr.length) {
          if (arr[q] == aux[j]) { break; }
          else q++;
        }
        if (q != arr.length) j++;
        else break;

      }
      for (let i = 0; i < spacePos.length; i++) {
        CopyArr[spacePos[i]] = aux[j];
      }
      let z = [1];
      z[0] = aux[j];
      CopyArr = (z).concat(CopyArr);
      return CopyArr;
    }
    else return arr;
  }
  return arr;
}

const MakeTable = () => {
  //Les éléments de table non valides. Que les caractères ASCII peuvent casser le code
  const exclamation = '!'.charCodeAt(0),
    lastPrintableChar = 127,
    dobleQ = '"'.charCodeAt(0),
    singleQ = "'".charCodeAt(0),
    openPa = '('.charCodeAt(0),
    minus = '-'.charCodeAt(0),
    zero = '0'.charCodeAt(0),
    dollarS = '$'.charCodeAt(0),
    at = '@'.charCodeAt(0),
    openBrac = '['.charCodeAt(0),
    slash = '/'.charCodeAt(0),
    openKey = '{'.charCodeAt(0);

  let outputTable = [];
  let i = 0;

  for (let j = exclamation; j < lastPrintableChar; j++) {
    if (j == zero) j = at;
    if (j != dobleQ &&
      j != singleQ &&
      j != openPa &&
      j != minus &&
      j != dollarS && j != openBrac && j != slash && j != openKey) outputTable[i++] = j;
  }
  return outputTable;
}

//==========================================
//             Global Variables              
//==========================================
const table = MakeTable();

//==========================================

export {Compress,Unzip}
