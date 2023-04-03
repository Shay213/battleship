import { GameBoard } from "../app/gameboard";
import { ComputerPlayer } from "../app/player";

expect.extend({
    toBeOneOf(received, validOptions) {
      const pass = validOptions.includes(received);
      if (pass) {
        return {
          message: () => `expected ${received} not to be one of ${validOptions}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be one of ${validOptions}`,
          pass: false,
        };
      }
    },
});

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
    let attack = computer.generateValidMove();
    
    expect(Array.isArray(attack)).toBe(true);
    expect(attack.length).toBe(2);
    expect(gameBoard.getBoard()[attack[0]][attack[1]]).toBeOneOf([0, 1]);

    attack = computer.playTurn();
    expect(gameBoard.getBoard()[attack[0]][attack[1]]).toBeOneOf(['x', 's']);
});

test('computer is getting feedback from gameBoard if all ships sunk', () => {
    const gameBoard = GameBoard();
    const computer = new ComputerPlayer(gameBoard);
    
    gameBoard.placeShip([0,0], {length: 3});
    gameBoard.receiveAttack([0,0]);
    gameBoard.receiveAttack([0,1]);
    expect(gameBoard.allSunk()).toBe(false);
    gameBoard.receiveAttack([0,2]);
    expect(gameBoard.allSunk()).toBe(true);

    expect(computer.won()).toBe(true);
});

test('computer can play a game against computer until winner is found', () => {
    const computerGameBoard1 = GameBoard();
    const computerGameBoard2 = GameBoard();
    populateBoard(computerGameBoard1);
    populateBoard(computerGameBoard2);
    const computerPlayer1 = new ComputerPlayer(computerGameBoard2);
    const computerPlayer2 = new ComputerPlayer(computerGameBoard1);
    let winnerFound = false;

    while(!winnerFound){
        computerPlayer1.playTurn();
        if(computerPlayer1.won()){
            winnerFound = true;
            break;
        }

        computerPlayer2.playTurn();
        if(computerPlayer2.won()){
            winnerFound = true;
            break;
        }
    }
    
    expect(winnerFound).toBeTruthy();
});