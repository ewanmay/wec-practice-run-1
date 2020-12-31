import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { AppContext } from './context/context';
import { Game } from '../../types'
import './App.css';


function App() {
  const [state, dispatch] = useContext(AppContext)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    state.socket.on('game-over', handleGameOver);
    state.socket.on('board-state', updateBoard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const makeMove = (coord: number) => {
    if (winner != null) return // game is over
    state.socket.emit('send-coord', coord)
  }

  const reset = () => {
    setWinner(null)
    state.socket.emit('reset-game')
  }

  const handleGameOver = (winner: string) => {
    setWinner(winner)
  }

  const updateBoard = (newGameState: Game) => {
    dispatch({ payload: newGameState, type: 'UPDATE_GAME' })
  }

  return (
    <div className="App flex center">

      {winner != null &&
        <div className="flex col-12 p-0 center fit row">
          <h1 className="col-12">
            Game Over! {winner ? `The winner is Player ${winner}` : "It's a tie!"}
          </h1>
        </div>
      }
      {winner == null &&
        <div className="flex col-12 p-0 center fit row">
          <h1 className="col-4">
            Player: {state.playersTurn}
          </h1>
        </div>
      }

      <div className="flex center board">
        {state.board.map((boardItem, index) => (
          <div className="col-4 p-0 flex center board-item" onClick={() => makeMove(index)}>
            <div className="fill">
              {boardItem}
            </div>
          </div>
        ))}
      </div>

      <Button variant="contained" color="primary" className="col-1 m-2" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}

export default App;