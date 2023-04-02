import { GameBoard } from "../app/gameboard";
import { Player } from "../app/player";
import { ComputerPlayer } from "../app/player";

const populateBoard = gameBoard => {
    gameBoard.placeShip([9,7]);
    gameBoard.placeShip([9,9]);
    gameBoard.placeShip([2,2]);
    gameBoard.placeShip([1,9]);
    gameBoard.placeShip([0,0], {length: 2});
    gameBoard.placeShip([8,0], {length: 2});
    gameBoard.placeShip([8,3], {length: 2, vertical: true});
    gameBoard.placeShip([7,5], {length: 3});
    gameBoard.placeShip([4,0], {length: 3, vertical: true});
    gameBoard.placeShip([0,4], {length: 4});
};

test("computer can generate random attack that hasn't been made before and mark the board with 'x'", () => {
    const gameBoard = GameBoard();
    const computer = new ComputerPlayer(gameBoard);
    for(let i=0; i<100; i++){
        computer.playTurn();
    }
    const board = computer.enemyGameBoard.getBoard();
    expect(board.reduce((a,b) => a+b.reduce((a,b) => b === 'x' ? a+1 : a+0,0), 0)).toBe(100);
});

test('computer is getting feedback from gameBoard if all ships sunk', () => {
    const gameBoard = GameBoard();
    populateBoard(gameBoard);
    const computer = new ComputerPlayer(gameBoard);
    for(let i=0; i<100; i++){
        computer.playTurn();
    }
    expect(computer.won()).toBeTruthy();
});

test('computer can play a game against human player and win', () => {
    const humanGameBoard = GameBoard();
    const computerGameBoard = GameBoard();
    populateBoard(humanGameBoard);
    populateBoard(computerGameBoard);
    const humanPlayer = new Player(computerGameBoard);
    const computerPlayer = new ComputerPlayer(humanGameBoard);
    let whoWon = null;
    loop1:
    for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
            humanPlayer.playTurn([i,j]);
            computerPlayer.playTurn();
            computerPlayer.playTurn();
            if(humanPlayer.won()){
                whoWon = 'player';
                break loop1;
            }else if(computerPlayer.won()){
                whoWon = 'computer';
                break loop1;
            }
        }
    }
    expect(whoWon).toBe('computer');
});

test('computer can play a game against computer until winner is found', () => {
    const computerGameBoard1 = GameBoard();
    const computerGameBoard2 = GameBoard();
    populateBoard(computerGameBoard1);
    populateBoard(computerGameBoard2);
    const computerPlayer1 = new ComputerPlayer(computerGameBoard2);
    const computerPlayer2 = new ComputerPlayer(computerGameBoard1);
    let winnerFound = false;
    for(let i=0; i<100; i++){
        computerPlayer1.playTurn();
        computerPlayer2.playTurn();

        if(computerPlayer1.won() || computerPlayer2.won()){
            winnerFound = true;
            break;
        }
    }
    expect(winnerFound).toBeTruthy();
});