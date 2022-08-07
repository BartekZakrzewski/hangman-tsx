import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style.css';

const App = () => {
  const [word, setWord] = useState(null);
  const [dashedWord, setDashed] = useState(null);
  const [len, setLen] = useState(null);
  const [wasUsed, setUsed] = useState([]);
  const [isGood, setGood] = useState([]);
  const [won, setWin] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [wrongIndex, setWIndex] = useState(0);
  const [lost, setLost] = useState(null);
  const [green, setGreen] = useState(0);
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);
  const litery = useRef([]);
  const iksy = useRef([]);
  const alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const Xs = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];

  useEffect(() => {
    console.log('New game!');
    axios
      .get('https://random-word-api.herokuapp.com/word')
      .then((res) => setWord(res.data[0]));
    setGreen(0);
    setUsed([]);
    setGood([]);
    setWrong([]);
    for (let i of alphabet) {
      setUsed((items) => {
        return [...items, false];
      });
      setGood((items) => {
        return [...items, false];
      });
    }
    for (let i of Xs) {
      setWrong((items) => {
        return [...items, false];
      });
    }
    setWIndex(0);
  }, []);

  useEffect(() => {
    let w: string = '';
    let j: number = 0;
    for (let i in word) {
      w += '-';
      j += 1;
    }
    setLen(j);
    setDashed(w);
  }, [word]);

  useEffect(() => {
    console.log(`green: ${green}`);
    if (len === green && green != 0) {
      setWins(wins + 1);
      setWin(true);
    }
  }, [green]);

  useEffect(() => {
    console.log(wrongIndex);
    if (wrongIndex != 0) {
      setWrong(
        wrong.map((item, index) => {
          return index < wrongIndex ? true : item;
        })
      );
    }
    if (wrongIndex >= 10) {
      setTimeout(() => {
        setWrong(wrong.map(() => false));
        setLoses(loses + 1);
        setLost(true);
      }, 50);
    }
  }, [wrongIndex]);

  const newGame = () => {
    console.log('New game!');
    axios
      .get('https://random-word-api.herokuapp.com/word')
      .then((res) => setWord(res.data[0]));
    setUsed([]);
    setGood([]);
    setGreen(0);
    for (let i of alphabet) {
      setUsed((items) => {
        return [...items, false];
      });
      setGood((items) => {
        return [...items, false];
      });
    }
    setWrong([]);
    for (let i of Xs) {
      setWrong((items) => {
        return [...items, false];
      });
    }
    setWIndex(0);
    setWin(false);
    setLost(false);
  };

  const handleGuess = (l: string, index: number) => {
    if (!wasUsed[index]) {
      let li: string;
      for (li in alphabet) {
        if (alphabet[li] === l) {
          let w: string = '';
          let lit: string;
          let c: number = 0;
          for (lit in word) {
            if (l === word[lit]) {
              w += word[lit];
              setGood(
                isGood.map((item, idx) => {
                  return idx == parseInt(li) ? true : item;
                })
              );
              c++;
            } else {
              w += dashedWord[lit];
            }
          }
          if (c == 0) {
            setWIndex(wrongIndex + 1);
          } else {
            setGreen(green + c);
          }
          setDashed(w);
        }
      }
    }
    setUsed(
      wasUsed.map((item, i) => {
        return i == index ? true : item;
      })
    );
  };

  return (
    <div className="container">
      <div className={`game ${won && 'game-won'} ${lost && 'game-lost'}`}>
        <div className="counter">
          <div className="wins">
            <span>Wins: </span>
            {wins}
          </div>
          <div className="loses">
            <span>Loses: </span>
            {loses}
          </div>
        </div>
        <h1 className="word">
          {dashedWord} ({len})
        </h1>
        <div className="letters">
          {alphabet.map((letter, index) => (
            <div
              className={`letter ${
                wasUsed[index] &&
                ((isGood[index] && 'good') || (!isGood[index] && 'bad'))
              }`}
              key={index}
              onClick={() => handleGuess(letter, index)}
              ref={litery[index]}
            >
              {letter}
            </div>
          ))}
        </div>
        <div className="xs">
          {Xs.map((x, index) => (
            <div
              key={index}
              className={`x ${wrong[index] && 'wrong'}`}
              ref={iksy[index]}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
      <div className={`${!won && 'game-won'} end-screen`}>
        <h1>You Won!</h1>
        <button onClick={() => newGame()}>Play again</button>
      </div>
      <div className={`${!lost && 'game-lost'} end-screen`}>
        <h1>You Lost!</h1>
        <button onClick={() => newGame()}>Play again</button>
      </div>
    </div>
  );
};

export default App;
