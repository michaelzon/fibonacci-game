import { useState, useEffect } from 'react';
import './App.css';

// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233 

//  5, 8, 13, 21, 34, 55, 89


// zo kan je er over heen loopen 
// function logMapElements(value, key, map) {
//   console.log(`[${key}] = ${value}`);
// }

// useEffect(() => {
//   map.forEach(logMapElements);
// }, [map]);
// const cache = getNthFibonacci(13);
// let exists = Object.values(cache).includes(89);


const size = 10;

const generateMap = (size) => {
  const map = new Map();
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const key = `${i}:${j}`
      map.set(key, null)
    }
  }
  return map;
};

const getNthFibonacci = (n, cache = { 1: 0, 2: 1 }) => {
  if (n in cache) {
    return cache;
  } else {
    cache[n] = getNthFibonacci(n - 1, cache)[n - 1] + getNthFibonacci(n - 2, cache)[n - 2];
    return cache;
  }
}


function App() {
  const [map, setMap] = useState(generateMap(size));
  const [clickedRow, setClickedRow] = useState(null);
  const [clickedCol, setClickedCol] = useState(null);
  const cache = getNthFibonacci(30);
  const fibs = Object.values(cache);
  const fibSet = new Set(fibs);



  const checkSequences = () => {

    // eerst verticaal
    const seq = [];

    for (let i = 4; i >= 0; i--) {
      // dit werkt voor nu alleen nog maar voor eerste kolom
      let value = map.get(`${clickedRow - i}:${0}`)

      // value is eerst null of undefined, maar deze check kan wel weg als die useEffect en de trigger voor deze functie beter is. 
      if (value !== null || value !== undefined) {
        seq.push(value);
      }
    };

    // console.log('seq', seq);

    const seqSet = new Set(seq);

    // console.log('seqSet', seqSet)

    // het is alleen true als ze er allemaal onderdeel van zijn en als de set een grote heeft van 5, elk element binnen een set moet uniek zijn.
    const fibInSeq = seqSet.isSubsetOf(fibSet) && seqSet.size === 5;

    if (fibInSeq) {
      for (let i = 4; i >= 0; i--) {
        map.delete(`${clickedRow - i}:${0}`);
        console.log('updated map after fib seq ', map)
      }


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

    var key = `${row}:${col}`
    var currentVal = map.get(key);

    console.log('key', key)

    // if (currentVal === NaN || currentVal === undefined) {
      // newMap.set(key, 1)
    // }

    newMap.set(key, currentVal + 1);

    for (let i = 0; i < size; i++) {
      if (i !== col) {
        const key = `${row}:${i}`;
        var currentVal = map.get(key);
        newMap.set(key, currentVal + 1);
      }
    };

    for (let j = 0; j < size; j++) {
      if (j !== row) {
        const key = `${j}:${col}`;
        var currentVal = map.get(key);
        newMap.set(key, currentVal + 1);
      }
    };

    setMap(newMap)
  }

  const updateMap = (row, col, map) => {
    incrementCells(row, col, map);
  }

  const rows = Array.from(Array(size).keys());
  const columns = Array.from(Array(size).keys());
  const subarr = [1, 1, 2, 3, 5];
  const subset = new Set(subarr);
  const fibset = new Set([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

  // wanneer chrome: 
  const processSequenceChrome = subset.isSubsetOf(fibset);
  // console.log('processSequenceChrome', processSequenceChrome);

  // wanneer firefox
  var count = 0;
  var processSequenceFirefox = false;

  for (let i = 0; i < 5; i++) {
    if (fibset.has(subarr[i])) {
      count++
    }
    if (count === 4) {
      processSequenceFirefox = true;
    }
  }

  // console.log('processSequenceFirefox', processSequenceFirefox);

  

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
                  <td key={col} onClick={() => incrementCells(row, col, map)}>{map.get(`${row}:${col}`) ? map.get(`${row}:${col}`) : '' }</td>
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
