import {validateCords} from './validateCords.js'

export class Player{
    constructor(enemyGameBoard){
        this.name = 'player';
        this.enemyGameBoard = enemyGameBoard;
    }

    playTurn(cords){
        const message = validateCords(cords);
        if(message) throw new Error(message);
        if(!this.isValidMove(cords)) throw new Error('This square was already chosen');
        this.enemyGameBoard.receiveAttack(cords);
    }

    isValidMove(cords){
        const board = this.enemyGameBoard.getBoard();
        const [x,y] = cords;
        return board[x][y] !== 'x' && board[x][y] !== 's';
    }

    won(){
        return this.enemyGameBoard.allSunk();
    }

    getEnemyBoard(){
        return this.enemyGameBoard.getBoard();
    }

    getName(){
        return this.name;
    }
};

export class ComputerPlayer extends Player{
    constructor(enemyGameBoard){
        super(enemyGameBoard);
        this.name = 'computer';
    }

    playTurn(){
        const cords = this.generateValidMove();
        this.enemyGameBoard.receiveAttack(cords);
        return cords;
    }

    generateValidMove(){
        let cords = this.generateRandomCords();
        while(!this.isValidMove(cords)){
            cords = this.generateRandomCords();
        }
        return cords;
    }

    generateRandomCords(){
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return [x,y];
    }
}