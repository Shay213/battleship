export const populateBoardRandomly = gameBoard => {
    const board = gameBoard.getBoard();
    const ships = [
        { length: 4 },
        { length: 3 },
        { length: 3 },
        { length: 2 },
        { length: 2 },
        { length: 2 },
        { length: 1 },
        { length: 1 },
        { length: 1 },
        { length: 1 },
    ];
    for (const { length } of ships){
        let x, y, vertical, isValid;
        while (true){
            try{
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                vertical = Math.random() < 0.5;
                gameBoard.placeShip([x,y], {length, vertical});
                break;
            }catch(e){}
        }
    }      
};