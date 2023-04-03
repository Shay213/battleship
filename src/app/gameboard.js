import { Ship } from "./ship";
import { validateCords } from "./validateCords";
import { markAdjacentSquares } from "./markAdjacentSquares";

export const GameBoard = () => {
    const board = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));
    const ships = [];

    const getBoard = () => board;
    const sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);

    const validateShipPlacement = (x, y, length, vertical) => {
        for(let i=0; i<length; i++){
            const row = vertical ? x+i : x;
            const col = vertical ? y : y+i;

            if(row < 0 || row >= 10 || col < 0 || col >= 10 || board[row][col] === 1) throw new Error();
            
            // Check for adjacent ships
            if(!vertical){
                if(row-1 >= 0 && board[row-1][col] === 1) throw new Error();
                if(row+1 < 10 && board[row+1][col] === 1) throw new Error();
                if(y-1 >= 0 && board[row][y-1] === 1) throw new Error();
                if(y+length < 10 && board[row][y+length] === 1) throw new Error(); 
                // check diagonal squares
                if(y-1 >= 0 && row-1 >= 0 && row+1 < 10 && (board[row-1][y-1] === 1 || board[row+1][y-1] === 1)) throw new Error();
                if(y+length < 10 && row-1 >= 0 && row+1 < 10 && (board[row-1][y+length] === 1 || board[row+1][y+length] === 1)) throw new Error();
            }
            else{
                if(col-1 >= 0 && board[row][col - 1] === 1) throw new Error();
                if(col+1 < 10 && board[row][col + 1] === 1) throw new Error();
                if(x-1 >= 0 && board[x-1][col] === 1) throw new Error();
                if(x+length < 10 && board[x+length][col] === 1) throw new Error();
                // check diagonal squares
                if(x-1 >= 0 && col-1 >= 0 && col+1 < 10 && (board[x-1][col-1] === 1 || board[x-1][col+1] === 1)) throw new Error();
                if(x+length < 10 && col-1 >= 0 && col+1 < 10 && (board[x+length][col-1] === 1 || board[x+length][col+1] === 1)) throw new Error();
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

    return {placeShip, getBoard, receiveAttack, allSunk, getShips};
};