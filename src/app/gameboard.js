export const GameBoard = () => {
    const board = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));

    const getBoard = () => board;

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
                if(y-1 >= 0 && row-1 >= 0 && row+1 < 10 && (board[row-1][y-1] || board[row+1][y-1])) throw new Error();
                if(y+length < 10 && row-1 >= 0 && row+1 < 10 && (board[row-1][y+length] || board[row+1][y+length])) throw new Error();
            }
            else{
                if(col-1 >= 0 && board[row][col - 1] === 1) throw new Error();
                if(col+1 < 10 && board[row][col + 1] === 1) throw new Error();
                if(x-1 >= 0 && board[x-1][col] === 1) throw new Error();
                if(x+length < 10 && board[x+length][col] === 1) throw new Error();
                // check diagonal squares
                if(x-1 >= 0 && col-1 >= 0 && col+1 < 10 && (board[x-1][col-1] || board[x-1][col+1])) throw new Error();
                if(x+length < 10 && col-1 >= 0 && col+1 < 10 && (board[x+length][col-1] || board[x+length][col+1])) throw new Error();
            }
        }
    };

    const validateArgs = (cords, options) => {
        if(!Array.isArray(cords)) return 'cords must be an array';
        const [x,y] = cords;
        if(!Number.isInteger(x) || !Number.isInteger(y) || cords.length > 2) return 'cords must be an array and contain pair of integers';
        
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

        console.log('placeShip called with:', cords, options);
        const {length, vertical} = options;
        const [x,y] = cords;
        validateShipPlacement(x, y, length, vertical);

        for(let i=0; i<length; i++){
            const row = vertical ? x+i : x;
            const col = vertical ? y : y+i;

            board[row][col] = 1;
        }
    };

    const receiveAttack = () => {

    };

    return {placeShip, getBoard};
};