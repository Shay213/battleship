export const GameBoard = () => {
    const board = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));

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

    const placeShip = ([x, y], {length=1, vertical=false} = {}) => {
        validateShipPlacement(x, y, length, vertical);

        for(let i=0; i<length; i++){
            const row = vertical ? x+i : x;
            const col = vertical ? y : y+i;

            board[row][col] = 1;
        }
    };

    const getBoard = () => board;

    return {placeShip, getBoard};
};