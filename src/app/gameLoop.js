import {GameBoard} from './gameboard';
import {Player} from './player';
import { ComputerPlayer } from './player';
import { DOM } from './DOM';

export const gameLoop = () => {
    DOM.renderBoard();
    const playerGameBoard = GameBoard();
    const computerGameBoard = GameBoard();
    populateBoard(playerGameBoard);
    populateBoard(computerGameBoard);
    const player = new Player(computerGameBoard);
    const computer = new ComputerPlayer(playerGameBoard);

    DOM.renderShips(playerGameBoard, computerGameBoard);
    DOM.activatePlayBtn(startGame);

    function startGame(){
        DOM.activateEnemyBoard();
        playRound(player, playerGameBoard, computer, computerGameBoard)
            .then(winner => console.log(`winner: ${winner.getName()}`))
            .catch(error => console.log(error));
        
        function playRound(player, playerGameBoard, computer, computerGameBoard){
            return DOM.attack(player, playerGameBoard)
                .then(won => {
                    if(won) return player;
                    
                    return DOM.attack(computer, computerGameBoard)
                        .then(won => {
                            if(won) return computer;

                            return playRound(player, playerGameBoard, computer, computerGameBoard);
                        });
                });
        }
    }
};

function populateBoard(gameBoard){
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