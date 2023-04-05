import xMark from '../assets/close-lg-svgrepo-com.svg';
import dot from '../assets/dot-small-svgrepo-com.svg';
import grayDot from '../assets/grayDot.svg';
import { markAdjacentSquares } from './markAdjacentSquares';

export const DOM = (function(){
    const playerHTMLBoard = document.querySelector('.player-board .board');
    const computerHTMLBoard = document.querySelector('.enemy-board .board');
    const btn = document.querySelector('.enemy-board > button');
    const enemyBoardElements = document.querySelectorAll('.enemy-board > *:not(button)');
    const playerBoardElements = document.querySelectorAll('.player-board > *:not(button)');
    const size = parseInt(playerHTMLBoard.offsetWidth/10);
    const gameResult = document.querySelector('.game-result');
    const messageBox = document.querySelector('.message-box');
    const playerDestroyedShips = document.querySelector('.player-destroyed-ships');
    const computerDestroyedShips = document.querySelector('.computer-destroyed-ships');

    const _strToArr = str => str.split(',').map(c => +c);
    const _sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);

    const renderBoard = () => {
        playerHTMLBoard.innerHTML = '';
        computerHTMLBoard.innerHTML = '';
        messageBox.innerHTML = '<p>Place the ships.</p>';
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

    const settingUpShips = gameBoard => {
        const ships = gameBoard.getShips();
        
        let currShipObj = null;
        let currShipElement = null;
        let isDragging = false;
        let squaresFromLeft = null;
        let squaresFromTop = null;
        let initialMouseX = 0;
        let initialMouseY = 0;
        let initialShipX = 0;
        let initialShipY = 0;
        let prevValidPosition = null;
        let shipClicked = false;

        btn.addEventListener('click', () => {
            document.removeEventListener('mousedown', getInitialValues);
            document.removeEventListener('mousemove', dragShip);
            document.removeEventListener('mouseup', handleShipClickOrDragEnd);
        });
        
        document.addEventListener('mousedown', getInitialValues);
        document.addEventListener('mousemove', dragShip);
        document.addEventListener('mouseup', handleShipClickOrDragEnd);

        function getInitialValues(e){
            if(e.target.classList.contains('ship')){
                shipClicked = true;
                isDragging = false;
                currShipObj = ships.find(shipObj => shipObj.getCords().find(cord => _sameArr(cord, _strToArr(e.target.dataset.shipcords))));
                currShipElement = e.target;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
                const computedStyle = window.getComputedStyle(e.target);
                const transform = computedStyle.transform;
                const transformValues = transform.split(/\(|\)|,/).slice(1, -1);
                initialShipX = parseFloat(transformValues[4]) || 0;
                initialShipY = parseFloat(transformValues[5]) || 0;
                squaresFromLeft = Math.floor(initialShipX / size + 0.5);
                squaresFromTop = Math.floor(initialShipY / size + 0.5);
                prevValidPosition = [squaresFromTop, squaresFromLeft];
            }
        }

        function dragShip(e){
            if((isDragging || (Math.abs(e.clientX - initialMouseX) > 5 || Math.abs(e.clientY - initialMouseY) > 5)) && shipClicked){
                isDragging = true;
                currShipElement.style.cursor = 'grabbing';
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;
                const newShipX = initialShipX + dx;
                const newShipY = initialShipY + dy;
                const currSquaresFromLeft = Math.floor(newShipX/size + 0.5);
                const currSquaresFromTop = Math.floor(newShipY/size + 0.5);

                const newCords = currShipObj.isVertical() ? 
                    Array.from({ length: currShipObj.getLength() }, (_, i) => [currSquaresFromTop + i,currSquaresFromLeft,])
                        : Array.from({ length: currShipObj.getLength() }, (_, i) => [currSquaresFromTop,currSquaresFromLeft + i,]);
                
                try{
                    gameBoard.validateShipPlacement(currSquaresFromTop, currSquaresFromLeft, currShipObj.getLength(), currShipObj.isVertical(), currShipObj);  
                    currShipElement.classList.add('valid-pos-dragging');
                    const board = gameBoard.getBoard();   
                    currShipObj.getCords().forEach(([x,y]) => board[x][y] = 0);
                    newCords.forEach(([x,y]) => board[x][y] = 1);
                    currShipObj.updateBoardCords(newCords);
                    currShipElement.dataset.shipcords = `${currSquaresFromTop},${currSquaresFromLeft}`;
                    currShipElement.style.transform = `translate(${(currSquaresFromLeft * size)-1}px, ${currSquaresFromTop * size}px)`;
                    prevValidPosition = [currSquaresFromTop, currSquaresFromLeft];
                }   
                catch(e){
                    currShipElement.classList.remove('valid-pos-dragging');
                    currShipElement.style.transform = `translate(${newShipX}px, ${newShipY}px)`;
                }
            }
        };

        function handleShipClickOrDragEnd(e){
            if(isDragging){
                isDragging = false;
                shipClicked = false;
                currShipElement.classList.remove('valid-pos-dragging');
                currShipElement.style.cursor = 'grab';
                currShipElement.style.transform = `translate(${(prevValidPosition[1] * size)-1}px, ${prevValidPosition[0] * size}px)`;
            }
            else if(e.target.classList.contains('ship')){
                rotateShip();
                shipClicked = false;
            }
        }

        function rotateShip(){   
            const shipCords = _strToArr(currShipElement.dataset.shipcords);
            const shipObj = ships.find(ship => _sameArr(ship.getCords()[0], shipCords));
            const isVertical = shipObj.isVertical();
            const length = shipObj.getLength();
            const [row, col] = shipCords;
            const newCords = !isVertical ? Array.from({length}, (_, i) => [row + i,col,]): Array.from({length}, (_, i) => [row,col + i,]);

            try{
                gameBoard.validateShipPlacement(row, col, length, !isVertical, shipObj);
                shipObj.setIsVertical(!isVertical);
                if(!isVertical === true){
                    currShipElement.style.width = `${size-1}px`;
                    currShipElement.style.height = `${(size * length)-1}px`;
                }else{
                    currShipElement.style.width = `${(size * length)-1}px`;
                    currShipElement.style.height = `${size-1}px`;
                }
                const board = gameBoard.getBoard();   
                currShipObj.getCords().forEach(([x,y]) => board[x][y] = 0);
                newCords.forEach(([x,y]) => board[x][y] = 1);
                currShipObj.updateBoardCords(newCords);
            }catch(error){
                const computedStyle = window.getComputedStyle(currShipElement);
                const transform = computedStyle.transform;
                const transformValues = transform.split(/\(|\)|,/).slice(1, -1);
                const x = parseFloat(transformValues[4]) || 0;
                const y = parseFloat(transformValues[5]) || 0;
                currShipElement.animate([
                    {transform: `translate(${x}px, ${y}px)`, borderColor: 'rgb(255, 116, 116)', outlineColor: 'rgb(255, 116, 116)'},
                    {transform: `translate(${x-5}px, ${y}px)`, borderColor: 'rgb(255, 116, 116)', outlineColor: 'rgb(255, 116, 116)'},
                    {transform: `translate(${x+5}px, ${y}px)`, borderColor: 'rgb(255, 116, 116)', outlineColor: 'rgb(255, 116, 116)'},
                    {transform: `translate(${x-5}px, ${y}px)`, borderColor: 'rgb(255, 116, 116)', outlineColor: 'rgb(255, 116, 116)'},
                    {transform: `translate(${x+5}px, ${y}px)`, borderColor: 'rgb(255, 116, 116)', outlineColor: 'rgb(255, 116, 116)'},
                    {transform: `translate(${x}px, ${y}px)`, borderColor: 'blue', outlineColor: 'blue'},
                ], 
                {duration: 500, iterations: 1});
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
            
            if(ship.isVertical()) {
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

    const attack = (player, gameBoard) => {
        return new Promise((resolve, reject) => {
            const ships = gameBoard.getShips().slice(0);
            const board = player.getEnemyBoard();
            let cords;
            if(player.getName() === 'computer'){
                const [...shipElements] = document.querySelectorAll('.player-board .board > div.ship');
                const enemySquares = playerHTMLBoard.querySelectorAll('div:not(div.ship)');

                messageBox.innerHTML = '<p>Opponents turn, please wait.</p>';
                enemyBoardElements.forEach(el => el.style.opacity = '.5');
                playerBoardElements.forEach(el => el.style.opacity = '1');
                computerHTMLBoard.classList.remove('active');

                setTimeout(() => {
                    cords = player.playTurn();
                    const targetSquare = [...enemySquares].find(square => _sameArr(_strToArr(square.dataset.cords), cords));
                    const shipObj = ships.find(ship => ship.getCords().find(el => _sameArr(el, cords)));
                    const [x, y] = cords;
                    
                    shipSunkAnimation(shipObj, shipElements, enemySquares, playerDestroyedShips);
                    markSquare(x, y, targetSquare);

                    if(board[x][y] === 's'){
                        const won = player.won();
                        if(won){
                            resolve(won);
                        }else{
                            attack(player, gameBoard).then(resolve);
                        }
                    }
                    else resolve(player.won());
                }, 500);
            }else{
                const [...shipElements] = document.querySelectorAll('.enemy-board .board > div.ship');
                const enemySquares = computerHTMLBoard.querySelectorAll('div:not(div.ship)');
                let playerMoved = false;

                messageBox.innerHTML = '<p>Your turn.</p>';
                playerBoardElements.forEach(el => el.style.opacity = '.5');
                computerHTMLBoard.classList.add('active');
                enemyBoardElements.forEach(el => el.style.opacity = '1');

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
                            
                            shipSunkAnimation(shipObj, shipElements, enemySquares, computerDestroyedShips);
                            markSquare(x, y, e.currentTarget);

                            if(board[x][y] === 's'){
                                const won = player.won();
                                if(won){
                                    playerBoardElements.forEach(el => el.style.opacity = '1');
                                    resolve(won);
                                }else{
                                    attack(player, gameBoard).then(resolve);
                                }
                            }
                            else resolve(player.won());
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
                    img.style.cssText = 'width: 49px; height: 49px;';
                    targetSquare.style.backgroundColor = '#fff2f2';
                }
                targetSquare.appendChild(img);
                targetSquare.classList.add('unavailable');
            }

            function shipSunkAnimation(shipObj, shipElements, enemySquares, destroyedShipsEl){
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

                    const shipLength = shipObj.getLength();
                    const [...ships] = destroyedShipsEl.querySelectorAll(`div[data-length="${shipLength}"]`);
                    const notDestroyedShip = ships.find(ship => !ship.classList.contains('destroyed'));
                    notDestroyedShip.classList.add('destroyed');
                }
            }
        });
    };

    const activateEnemyBoard = () => {
        btn.style.display = 'none';
        enemyBoardElements.forEach(el => el.style.opacity = '1');
        computerHTMLBoard.classList.add('active');
        playerDestroyedShips.style.display = 'grid';
        computerDestroyedShips.style.display = 'grid';
        playerHTMLBoard.querySelectorAll('div.ship').forEach(el => el.style.cursor = 'auto');
    }

    const deActivateEnemyBoard = () => {
        btn.style.display = 'block';
        enemyBoardElements.forEach(el => el.style.opacity = '.3');
        computerHTMLBoard.classList.remove('active');
    };

    const showFinalMessage = (message, playerWon) => {
        return new Promise(resolve => {
            gameResult.querySelector('p').innerText = message;
            playerWon ? gameResult.style.backgroundColor = '#58c42d' : gameResult.style.backgroundColor = '#f70c2b';
            gameResult.style.display = 'flex';
            gameResult.querySelector('button').addEventListener('click', e => {
                gameResult.style.display = 'none';
                [...playerDestroyedShips.querySelectorAll('div.destroyed'),
                 ...computerDestroyedShips.querySelectorAll('div.destroyed')]
                    .forEach(el => el.classList.remove('destroyed'));
                playerDestroyedShips.style.display = 'none';
                computerDestroyedShips.style.display = 'none';
                playerHTMLBoard.querySelectorAll('div.ship').forEach(el => el.style.cursor = 'grab');
                resolve();
            }, {once: true});
        });
    };

    const activatePlayBtn = (startGame) => btn.addEventListener('click', startGame, {once: true});

    return {
        renderShips,
        renderBoard,
        activatePlayBtn,
        activateEnemyBoard,
        attack,
        showFinalMessage,
        deActivateEnemyBoard,
        settingUpShips
    };
})();