import './App.css';

import produce from 'immer';
import React, { useCallback, useRef, useState } from 'react';

// initial grid size constants
const numRows: number = 50;
const numCols: number = 100;

// helper functions to create grid of random cells
const createRandomGrid = () => {
  let rows = [];
  for (let i = 0; i < numRows; i++) {
    // value of 1 is alive and 0 is dead
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)));
  }
  return rows;
};

// helper function  to create empty grid
const createEmptyGrid = () => {
  let rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

// the 8 operations to check neighborhood
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function App() {
  const [grid, setGrid] = useState(createRandomGrid());
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current;

  // applies the rules to each grid, treats grid as immutable
  const runGame = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    // animation speed
    setTimeout(runGame, 250);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={() => {
          setRunning(!running);
          runningRef.current = false;
          if (!running) {
            runningRef.current = true;
            runGame();
          }
        }}
      >
        {`${running ? 'Stop' : 'Start'} simulation`}
      </button>
      <button
        onClick={() => {
          setGrid(createEmptyGrid());
        }}
      >
        Empty Grid
      </button>
      <button
        onClick={() => {
          setGrid(createRandomGrid());
        }}
      >
        Random Grid
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 15px`,
        }}
      >
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              tabIndex={0}
              role="button"
              key={`${rowIdx}-${colIdx}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowIdx][colIdx] = gridCopy[rowIdx][colIdx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 15,
                height: 15,
                backgroundColor: grid[rowIdx][colIdx] ? 'black' : '#C9DAF8',
              }}
              aria-hidden="true"
            />
          )),
        )}
      </div>
    </div>
  );
}

export default App;
