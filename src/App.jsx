import { useEffect, useState } from 'react';
import apple from './img/apple.png';
import banana from './img/banana.png';
import grapes from './img/grapes.png';
import kiwi from './img/kiwi.png';
import pear from './img/pear.png';
import tangerine from './img/tangerine.png';
import blank from './img/square.png';
import ScoreBoard from './components/ScoreBoard';

const width = 8;
const fruits = [apple, banana, grapes, kiwi, pear, tangerine];

const App = () => {
  const [currentFruit, setCurrentFruit] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnOfThree = () => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentFruit[i];

      if (
        columnOfThree.every(square => currentFruit[square] === decidedColor)
      ) {
        columnOfThree.forEach(square => (currentFruit[square] = blank));
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentFruit[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentFruit[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          square => currentFruit[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay(score => score + 3);
        rowOfThree.forEach(square => (currentFruit[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentFruit[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentFruit[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          square => currentFruit[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay(score => score + 4);
        rowOfFour.forEach(square => (currentFruit[square] = blank));
        return true;
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnOfFour = () => {
    for (let i = 0; i < 39; i++) {
      const columnOfFour = [i, i + width, i + width * 3];
      const decidedColor = currentFruit[i];

      if (columnOfFour.every(square => currentFruit[square] === decidedColor)) {
        columnOfFour.forEach(square => (currentFruit[square] = blank));
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentFruit[i] === blank) {
        let randomNumber = Math.floor(Math.random() * fruits.length);
        currentFruit[i] = fruits[randomNumber];
      }

      if (currentFruit[i + width] === blank) {
        currentFruit[i + width] = currentFruit[i];
        currentFruit[i] = blank;
      }
    }
  };

  const dragStart = e => {
    setSquareBeingDragged(e.target);
  };
  const dragDrop = e => {
    setSquareBeingReplaced(e.target);
  };
  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute('data-id')
    );
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute('data-id')
    );

    currentFruit[squareBeingReplacedId] =
      squareBeingDragged.getAttribute('src');
    currentFruit[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentFruit[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute('src');
      currentFruit[squareBeingDraggedId] =
        squareBeingDragged.getAttribute('src');
      setCurrentFruit([...currentFruit]);
    }
  };

  const createBoard = () => {
    let randomColorsArray = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = fruits[Math.floor(Math.random() * fruits.length)];
      randomColorsArray.push(randomColor);
    }
    setCurrentFruit(randomColorsArray);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfThree();
      checkForColumnOfFour();
      checkForRowOfThree();
      checkForRowOfFour();
      moveIntoSquareBelow();
      setCurrentFruit([...currentFruit]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForColumnOfThree,
    checkForRowOfFour,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentFruit,
  ]);

  return (
    <div className="app">
      <div className="game">
        {currentFruit.map((fruit, idx) => (
          <img
            key={idx}
            style={{ backgroundColor: fruit }}
            src={fruit}
            alt={fruit}
            data-id={idx}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
            onDragLeave={e => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
