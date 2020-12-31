import { Game } from "../types";
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
})

const PORT = 5000;

io.on('connection', (socket: any) => {
  console.log('User Connected');


  const boardState: Game = {
    board: new Array(9).fill(null),
    playersTurn: 'x'
  };
  sendBoardState(socket, boardState);

 
  socket.on('reset-game', () => {
    console.log('Resetting game')
    boardState.board = new Array(9).fill(null)
    boardState.playersTurn = 'x';

    sendBoardState(socket, boardState);
  });

  socket.on('send-coord', (coord: number) => {
    if (boardState.board[coord]) return // tile already marked
    const currentPlayer = boardState.playersTurn;
    boardState.board[coord] = currentPlayer
    boardState.playersTurn = currentPlayer === 'x' ? 'o' : 'x'
    checkWinConditions(socket, boardState.board)
    sendBoardState(socket, boardState);
  });

  socket.on('disconnect', () => {
  });
});

const sendBoardState = (socket: any, boardState: Game) => {
  socket.emit('board-state', boardState);
};

const checkWinConditions = (socket: any, board: Array<String>) => {
  // Check row
  for(let i: number = 0; i<9; i+=3){
    if(board[i] === board[i+1] && board[i+1] === board[i+2] && board[i+2] !== null){
      socket.emit('game-over', board[i]);
      return;
    }
  }

  // Check col
  for(let i: number = 0; i<3; i++){
    if(board[i] === board[i+3] && board[i+3] === board[i+6] && board[i+6] !== null){
      socket.emit('game-over', board[i]);
      return;
    }
  }

  // Check cross
  if(board[0] === board[4] && board[4] === board[8] && board[8] !== null){
    socket.emit('game-over', board[0]);
    return;
  }
  if(board[2] === board[4] && board[4] === board[6] && board[6] !== null){
    socket.emit('game-over', board[2]);
    return;
  }

  // Check full
  if(!board.filter((value: String | null) => value == null).length){
    socket.emit('game-over', "");
    return;
  }

}
  

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
