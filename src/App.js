import { useState, useEffect } from 'react';
import './App.css';

// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233 

// zo kan je er over heen loopen 
// function logMapElements(value, key, map) {
//   console.log(`[${key}] = ${value}`);
// }

// useEffect(() => {
//   map.forEach(logMapElements);
// }, [map]);
// const cache = getNthFibonacci(13);
// let exists = Object.values(cache).includes(89);

// const generateMap = (size) => {
//   const map = new Map();
//   for (let i = 0; i < size; i++) {
//     for (let j = 0; j < size; j++) {
//       const key = `${i}:${j}`
//       map.set(key, null)
//     }
//   }
//   return map;
// };

// const subset = new Set(subarr);
// const fibset = new Set([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

// // wanneer chrome: 
// const processSequenceChrome = subset.isSubsetOf(fibset);
// console.log('processSequenceChrome', processSequenceChrome);

// // wanneer firefox
// var count = 0;
// var processSequenceFirefox = false;

// for (let i = 0; i < 5; i++) {
//   if (fibset.has(subarr[i])) {
//     count++
//   }
//   if (count === 4) {
//     processSequenceFirefox = true;
//   }
// }

// console.log('processSequenceFirefox', processSequenceFirefox);

const size = 12;

const getNthFibonacci = (n, cache = { 1: 1, 2: 1 }) => {
  if (n in cache) {
    return cache;
  } else {
    cache[n] = getNthFibonacci(n - 1, cache)[n - 1] + getNthFibonacci(n - 2, cache)[n - 2];
    return cache;
  }
}


function getKeyByValue(cache, value) {
  for (let prop in cache) {
    if (cache.hasOwnProperty(prop)) {
      if (cache[prop] === value)
        return prop;
    }
  }
}

function App() {
  // const [map, setMap] = useState(generateMap(size));
  const [map, setMap] = useState(new Map());
  const [clickedRow, setClickedRow] = useState(null);
  const [clickedCol, setClickedCol] = useState(null);
  const fibCache = getNthFibonacci(30);
  const fibs = Object.values(fibCache);
  const fibSet = new Set(fibs);

  const verticalSeqs = []


  const verticalSeqsForCol = []

  // dit is een check voor als je klikt op de rij waar je wil eindigen met de seq die je aan het maken bent. Dus vanaf rij 4... van boven naar onder.
  for (let i = 0; i < size; i++){
    const seq = [];
    for (let j = clickedRow - 4; j <= clickedRow; j++) {
      const key = `${j}:${i}`
      let value = map.get(key);

      // hier kan je ook nog conditional doen dat de value niet in fibset voorkomt en dan kan je die subset van functie laterop skippen
      if (value === null || value === undefined ) {
        break
      }
      seq.push(value);
    }
    verticalSeqs.push(seq);
  }

  console.log('vertical seqs', verticalSeqs);

  

  const checkSequences = () => {
    const newMap = new Map(map);

    for (let col = 0; col < size; col++) {
      

      for (let row = 0; row < 5; row++) {

        let value = map.get(`${clickedRow - row}:${col}`)
        // value is eerst null of undefined, maar deze check kan wel weg als die useEffect en de trigger voor deze functie beter is. 
        if (value !== null && value !== undefined) {
          // seq.push(value);
        }

        // console.log('seq that is put into vertical seqs', seq);

      };
      // verticalSeqs.push(seq)

  
    }

    // console.log('verticalSeqs', verticalSeqs);

   

    // for (let i = 0; i < seq.length; i++) {
    // console.log(seq[i]);
    // }

    const seq2 = [1, 1, 1, 1, 1];
    // het is alleen true als ze er allemaal onderdeel van zijn en als de set een grote heeft van 5, elk element binnen een set moet uniek zijn.
    const seqSet = new Set(seq2);
    const fibInSeq = seqSet.isSubsetOf(fibSet) && seqSet.size === 5;

    // console.log('fibset', fibSet);
    // console.log('seqset', seqSet);
    // console.log('fib in seq', fibInSeq)

    // todo check ook nog of ze achtereenvolgend in de fiboseq zijn. ik retrieve de key uit de cache met de eerste value van de sequence (en daarmee ook de laagste, hoef ik minder te ittereren tijdens het ophalen van de key en ga daarna gewoon kijken of de vier values van de opeenvolgende keys uit het cache object overeenkomen met de waardes in mijn cache. )
    // moet je wel aparte regels schrijven voor wanner je van boven naar onder gaat controleren? of je sorteert ze gewoon eerst altijd oplopend 
    // je wil dit ook pas doen als fibInSeq op true staat, anders gaat ie onnodig values opzoeken die toch niet in de fibreeks staan. 
    
    // console.log('seqje dat we gaan checken:', seq2)
    let keyForLookUp = Number(getKeyByValue(fibCache, seq2[0]));

    // console.log('eerste element uit seq heeft key in fibocache:', keyForLookUp);

    let consecutiveFibos = false;

    if (fibInSeq) {

      for (let i = 0; i < 5; i++) {
        // Increment keyForLookUp by i
        // console.log('keyForLookUp', keyForLookUp);
        // console.log('i', i);
        const adjacentKey = keyForLookUp+i;
        // console.log('adjacentKey', adjacentKey);
        // console.log('fibCache[adjacentKey]', fibCache[adjacentKey])
        if (seq2[i] === fibCache[adjacentKey]){
          consecutiveFibos = true
        }
        else {
          consecutiveFibos = false
        };
      }
  
      // console.log('consecutive fibos', consecutiveFibos);
    }

    if (fibInSeq && consecutiveFibos) {
      for (let i = 4; i >= 0; i--) {
        newMap.delete(`${clickedRow - i}:${0}`);
      }
      setMap(newMap)
      // hoe weet je welke coordinaten je moet hebben? 
      // clearCells()
    }
  }

  useEffect(() => {
    checkSequences();
  }, [map])

  const incrementCells = (row, col, map) => {

    // this can be set elsewhere, not a really nice spot, needed for check sequences functies because its lagging behind 
    setClickedRow(row);
    setClickedCol(col);

    const newMap = new Map(map);

    for (let y = 0; y < size; y++) {
      const key = `${row}:${y}`;
      const colVal = map.get(key);
      newMap.set(key, (colVal === undefined || isNaN(colVal)) ? 1 : colVal + 1)
    };

    for (let x = 0; x < size; x++) {
      const key = `${x}:${col}`;
      const rowVal = map.get(key);
      newMap.set(key, (rowVal === undefined || isNaN(rowVal)) ? 1 : rowVal + 1)
    };

    setMap(newMap)
  }

  const updateMap = (row, col, map) => {
    incrementCells(row, col, map);
  }

  const rows = Array.from(Array(size).keys());
  const columns = Array.from(Array(size).keys());

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className='invisible'></th>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className='first'>{row}</td>
              {columns.map((col) => {
                return (
                  <td key={col} onClick={() => incrementCells(row, col, map)}>{map.get(`${row}:${col}`) ? map.get(`${row}:${col}`) : ''}</td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button onClick={() => geef()}> harry? </button> */}
    </>
  )
}

export default App;
