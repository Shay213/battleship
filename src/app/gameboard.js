import { Ship } from "./ship";
import { validateCords } from "./validateCords";
import { markAdjacentSquares } from "./markAdjacentSquares";

export const GameBoard = () => {
    const board = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));
    let ships = [];

    const getBoard = () => board;
    const sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);

    const validateShipPlacement = (x, y, length, vertical, excludeShip=null) => {
        const occupiedSquares = new Set();
        
        for(const ship of ships){
            if(excludeShip && sameArr(ship.getCords(), excludeShip.getCords())) continue;
            for(const square of ship.getCords()){
                occupiedSquares.add(square.join(','));
            }
        }
        
        for(let i = 0; i < length; i++){
            const row = vertical ? x + i : x;
            const col = vertical ? y : y + i;
        
            if(row < 0 || row >= 10 || col < 0 || col >= 10 || occupiedSquares.has(`${row},${col}`)){
                throw new Error();
            }
        
            // Check for adjacent squares
            for (let r = row - 1; r <= row + 1; r++){
                for (let c = col - 1; c <= col + 1; c++){
                    if (r < 0 || r >= 10 || c < 0 || c >= 10){
                        continue;
                    }
                    if(occupiedSquares.has(`${r},${c}`)){
                        throw new Error();
                    }
                }
            }
        }
    };

    const validateArgs = (cords, options) => {
        const message = validateCords(cords);
        if(message) return message;
        
        if(options && typeof options !== 'object') return 'options must be an object';
        if(options.hasOwnProperty('length') && !Number.isInteger(options.length)) return 'length in options must be integer';
        if(options.hasOwnProperty('vertical') && typeof options.vertical !== 'boolean') return 'vertical in options must be boolean';

        return false;
    };

    const placeShip = (cords, options = {}) => {
        const message = validateArgs(cords, options);
        if(message) throw new Error(message);

        if(!options.hasOwnProperty('length')) options['length'] = 1;
        if(!options.hasOwnProperty('vertical')) options['vertical'] = false;

        const {length, vertical} = options;
        const [x,y] = cords;
        const shipCords = [];

        validateShipPlacement(x, y, length, vertical);

        for(let i=0; i<length; i++){
            const row = vertical ? x+i : x;
            const col = vertical ? y : y+i;

            board[row][col] = 1;
            shipCords.push([row, col]);
        }
        ships.push(Ship(length, vertical, shipCords));
    };

    const receiveAttack = cords => {
        const [x, y] = cords;
        if(board[x][y] === 1){
            const shipIndex = ships.findIndex(ship => ship.getCords().find(el => sameArr(el, cords)));
            ships[shipIndex].hit();
            board[x][y] = 's';
            if(ships[shipIndex].isSunk()){
                ships[shipIndex].getCords().forEach(([x,y]) => {
                    markAdjacentSquares(board, x, y, 0, ([adjX, adjY]) => board[adjX][adjY] = 'x');
                });
                ships.splice(shipIndex, 1);
            }   
        }
        else{
            board[x][y] = 'x';
        }
    };

    const allSunk = () => ships.length === 0;
    const getShips = () => ships;

    return {placeShip, getBoard, receiveAttack, allSunk, getShips, validateShipPlacement};
};