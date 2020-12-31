export interface State {
  socket: SocketIOClient.Socket,
  board: Array<String | null>  
  playersTurn: String;
}