export const DOM = (function(){
    const playerHTMLBoard = document.querySelector('.player-board .board');
    const computerHTMLBoard = document.querySelector('.enemy-board .board');
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

    const _addShipsToBoard = (ships, board) => {
        ships.forEach(ship => {
            const cords = ship.getCords();
            const length = cords.length;
            const div = document.createElement('div');
            div.classList.add('ship');
            
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

        _addShipsToBoard(playerShips, playerHTMLBoard);
        _addShipsToBoard(computerShips, computerHTMLBoard);
    };   

    return {renderShips, renderBoard};
})();