import { useState, useEffect } from 'react';
import './App.css';

// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233 

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
  const [region, setRegion] = useState({});
  const fibCache = getNthFibonacci(30);
  const fibs = Object.values(fibCache);
  const fibSet = new Set(fibs);
  const seqLength = 5;


  var totalSeq = {};

  for (let col = 0; col < size; col++) {

    // verticaal
    for (let row = -seqLength + 1; row < seqLength; row++) {
      const x = clickedRow + row
      const key = `${x}:${col}`
      let value = map.get(key);
      
      if (value !== null && value !== undefined) {
        console.log('key', key, 'value', value);
      }

      if (value === null || value === undefined) {
        break
      }

      totalSeq[key] = value;
    }
  }

  console.log('totalSeq', totalSeq)

  const verticalSeqs = []
  const verticalSeqsForCol = []

  // dit is een check voor als je klikt op de rij waar je wil eindigen met de seq die je aan het maken bent. Dus vanaf rij 4... van boven naar onder.
  for (let i = 0; i < size; i++) {
    const seq = [];
    // for (let k = 0; k < 5; k++)

    for (let j = clickedRow - 4; j <= clickedRow; j++) {
      const key = `${j}:${i}`
      let value = map.get(key);

      // hier kan je ook nog conditional doen dat de value niet in fibset voorkomt en dan kan je die subset van functie laterop skippen
      if (value === null || value === undefined) {
        break
      }
      seq.push(value);
    }
    verticalSeqs.push(seq);
  }

  // console.log('vertical seqs', verticalSeqs);

  const checkSequences = () => {
    const newMap = new Map(map);
    for (let col = 0; col < size; col++) {
      const seq = []
      for (let row = 0; row < 5; row++) {
        let value = map.get(`${clickedRow - row}:${col}`)
        if (value !== null && value !== undefined) {
          seq.push(value);
        }
      }
      verticalSeqs.push(seq)
    }
    // console.log('verticalSeqs', verticalSeqs);

    const seq2 = [1, 1, 1, 1, 1];

    // het is alleen true als ze er allemaal onderdeel van zijn en als de set een grote heeft van 5, elk element binnen een set moet uniek zijn.
    const seqSet = new Set(seq2);
    const fibInSeq = seqSet.isSubsetOf(fibSet) && seqSet.size === 5;
    let keyForLookUp = Number(getKeyByValue(fibCache, seq2[0]));
    let consecutiveFibos = false;

    if (fibInSeq) {

      for (let i = 0; i < 5; i++) {
        const adjacentKey = keyForLookUp + i;
        if (seq2[i] === fibCache[adjacentKey]) {
          consecutiveFibos = true
        }
        else {
          consecutiveFibos = false
        };
      }

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



  const checkClickedHorizontalRow = () => {
    const newMap = new Map(map);
    console.log('newMap', newMap);
  }

  useEffect(() => {
    checkSequences();
    checkClickedHorizontalRow(); 
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
    }

    for (let x = 0; x < size; x++) {
      const key = `${x}:${col}`;
      const rowVal = map.get(key);
      newMap.set(key, (rowVal === undefined || isNaN(rowVal)) ? 1 : rowVal + 1)
    }

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
