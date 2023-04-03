export const markAdjacentSquares = (board, x, y, valToCompare, callback) => {
    const rows = board.length;
    const cols = board[0].length;
    
    // Check top, bottom, left, and right squares
    if (x > 0 && board[x - 1][y] === valToCompare) callback([x - 1, y]);
    if (x < rows - 1 && board[x + 1][y] === valToCompare) callback([x + 1, y]);
    if (y > 0 && board[x][y - 1] === valToCompare) callback([x, y - 1]);
    if (y < cols - 1 && board[x][y + 1] === valToCompare) callback([x, y + 1]);
  
    // Check diagonal squares
    if (x > 0 && y > 0 && board[x - 1][y - 1] === valToCompare) callback([x - 1, y - 1]);
    if (x > 0 && y < cols - 1 && board[x - 1][y + 1] === valToCompare) callback([x - 1, y + 1]);
    if (x < rows - 1 && y > 0 && board[x + 1][y - 1] === valToCompare) callback([x + 1, y - 1]);
    if (x < rows - 1 && y < cols - 1 && board[x + 1][y + 1] === valToCompare) callback([x + 1, y + 1]);
};