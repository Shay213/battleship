import {GameBoard} from './gameboard';
import {Player} from './player';
import { ComputerPlayer } from './player';
import { DOM } from './DOM';
import { populateBoardRandomly } from './populateBoardRandomly';

export const gameLoop = () => {
    DOM.renderBoard();
    const playerGameBoard = GameBoard();
    const computerGameBoard = GameBoard();
    populateBoardRandomly(playerGameBoard);
    populateBoardRandomly(computerGameBoard);
    const player = new Player(computerGameBoard);
    const computer = new ComputerPlayer(playerGameBoard);

    DOM.renderShips(playerGameBoard, computerGameBoard);
    DOM.activatePlayBtn(startGame);
    DOM.settingUpShips(playerGameBoard);

    function startGame(){
        DOM.activateEnemyBoard();
        playRound(player, playerGameBoard, computer, computerGameBoard)
            .then(winner => {
                let message;
                let playerWon;
                if(winner.getName() === 'player'){
                    message = 'Game over. You win.';
                    playerWon = true;
                }else{
                    message = 'Game over. You lose.';
                    playerWon = false;
                }
                DOM.showFinalMessage(message, playerWon)
                    .then(() => {
                        DOM.deActivateEnemyBoard();
                        gameLoop();
                    });
            })
            .catch(error => console.log(error));
        
        function playRound(player, playerGameBoard, computer, computerGameBoard){
            return DOM.attack(player, computerGameBoard)
                .then(won => {
                    if(won) return player;
                    
                    return DOM.attack(computer, playerGameBoard)
                        .then(won => {
                            if(won) return computer;

                            return playRound(player, playerGameBoard, computer, computerGameBoard);
                        });
                });
        }
    }
};