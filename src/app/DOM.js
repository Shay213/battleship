import xMark from '../assets/close-lg-svgrepo-com.svg';
import dot from '../assets/dot-small-svgrepo-com.svg';
import grayDot from '../assets/grayDot.svg';
import { markAdjacentSquares } from './markAdjacentSquares';

export const DOM = (function(){
    const playerHTMLBoard = document.querySelector('.player-board .board');
    const computerHTMLBoard = document.querySelector('.enemy-board .board');
    const btn = document.querySelector('.enemy-board > button');
    const enemyBoardElements = document.querySelectorAll('.enemy-board > *:not(button)');
    const size = parseInt(playerHTMLBoard.offsetWidth/10);

    const renderBoard = () => {
        const boards = [playerHTMLBoard, computerHTMLBoard];
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                boards.forEach(board => {
                    const div = document.createElement('div');
                    div.setAttribute('data-cords', `${i},${j}`);
                    board.appendChild(div);
                });
            }
        }
    };

    const _addShipsToHTMLBoard = (ships, board) => {
        ships.forEach((ship, i) => {
            const cords = ship.getCords();
            const length = cords.length;
            const div = document.createElement('div');
            div.classList.add('ship');
            div.setAttribute('data-shipCords', `${cords[0]}`);

            if (ship.isVertical()) {
                div.style.width = `${size-1}px`;
                div.style.height = `${(size * length)-1}px`;
                div.style.transform = `translate(${(cords[0][1] * size)-1}px, ${cords[0][0] * size}px)`;
            }else{
                div.style.width = `${(size * length)-1}px`;
                div.style.height = `${size-1}px`;
                div.style.transform = `translate(${(cords[0][1] * size)-1}px, ${cords[0][0] * size}px)`;
            }
            board.appendChild(div);
        });
    };

    const renderShips = (playerGameBoard, computerGameBoard) => {
        const playerShips = playerGameBoard.getShips();
        const computerShips = computerGameBoard.getShips();

        _addShipsToHTMLBoard(playerShips, playerHTMLBoard);
        _addShipsToHTMLBoard(computerShips, computerHTMLBoard);
    };   

    const _strToArr = str => str.split(',').map(c => +c);
    const _sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);

    const attack = (player, gameBoard) => {
        return new Promise((resolve, reject) => {
            const ships = gameBoard.getShips();
            const board = player.getEnemyBoard();
            let cords;
            if(player.getName() === 'computer'){
                const [...shipElements] = document.querySelectorAll('.player-board .board > div.ship');
                const enemySquares = playerHTMLBoard.querySelectorAll('div:not(div.ship)');
                const shipObj = ships.find(ship => ship.getCords().find(el => _sameArr(el, cords)));
                cords = player.playTurn();
                const targetSquare = [...enemySquares].find(square => _sameArr(_strToArr(square.dataset.cords), cords));
                const [x, y] = cords;

                shipSunkAnimation(shipObj, shipElements, enemySquares);
                markSquare(x, y, targetSquare);

                resolve(player.won());
            }else{
                const [...shipElements] = document.querySelectorAll('.enemy-board .board > div.ship');
                const enemySquares = computerHTMLBoard.querySelectorAll('div:not(div.ship)');
                let playerMoved = false;
                enemySquares.forEach(square => {
                    const squareCords = _strToArr(square.dataset.cords);
                    const [x,y] = squareCords;
                    if(board[x][y] !== 'x' && board[x][y] !== 's'){
                        square.addEventListener('click', e => {
                            if(playerMoved) return;
                            playerMoved = true;
                            cords = _strToArr(e.currentTarget.dataset.cords);
                            const shipObj = ships.find(ship => ship.getCords().find(el => _sameArr(el, cords)));
                            player.playTurn(cords);
                            
                            shipSunkAnimation(shipObj, shipElements, enemySquares);
                            markSquare(x, y, e.currentTarget);

                            resolve(player.won());
                        });
                    }
                });
            }

            function markSquare(x, y, targetSquare){
                const img = new Image();
                if(board[x][y] === 'x'){
                    img.src = dot;
                    targetSquare.style.backgroundColor = '#fafcff';
                }
                else if(board[x][y] === 's'){
                    img.src = xMark;
                    img.style.cssText = 'width: 42px; height: 42px;';
                    targetSquare.style.backgroundColor = '#fff2f2';
                }
                targetSquare.appendChild(img);
                targetSquare.classList.add('unavailable');
            }

            function shipSunkAnimation(shipObj, shipElements, enemySquares){
                if(shipObj && shipObj.getCords().every(([x,y]) => board[x][y] === 's')){
                    const shipEl = shipElements.find(ship => shipObj.getCords().find(el => _sameArr(el, _strToArr(ship.dataset.shipcords))));
                    shipEl.style.cssText += 'display: block; border-color: #ff2424; outline-color: #ff2424; background-color: transparent;';
                    shipObj.getCords().forEach(([x,y]) => {
                        markAdjacentSquares(board, x, y, 'x', el => {
                            const squareEl = [...enemySquares].find(square => _sameArr(_strToArr(square.dataset.cords), el));
                            if(!squareEl.firstChild){
                                const img = new Image();
                                img.src = grayDot;
                                squareEl.style.backgroundColor = '#fafcff';
                                squareEl.classList.add('unavailable');
                                squareEl.appendChild(img);
                            }
                        });
                    });
                }
            }
        });
    };

    const activateEnemyBoard = () => {
        btn.style.display = 'none';
        enemyBoardElements.forEach(el => el.style.opacity = '1');
        computerHTMLBoard.classList.add('active');
    }

    const activatePlayBtn = (startGame) => btn.addEventListener('click', startGame);

    return {
        renderShips,
        renderBoard,
        activatePlayBtn,
        activateEnemyBoard,
        attack
    };
})();