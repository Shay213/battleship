import {validateCords} from './validateCords.js'

export class Player{
    constructor(name, enemyGameBoard){
        this.name = name;
        this.enemyGameBoard = enemyGameBoard;
    }

    playTurn(cords){
        const message = validateCords(cords);
        if(message) throw new Error(message);
        this.enemyGameBoard.receiveAttack(cords);
    }

    won(){
        return this.enemyGameBoard.allSunk();
    }
};

export class ComputerPlayer extends Player{
    constructor(enemyGameBoard){
        super('Computer', enemyGameBoard);
    }

    playTurn(){
        let cords = this.generateRandomCords();
        while(!this.isValidMove(cords)){
            cords = this.generateRandomCords();
        }
        this.enemyGameBoard.receiveAttack(cords);
    }

    generateRandomCords(){
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return [x,y];
    }

    isValidMove(cords){
        const board = this.enemyGameBoard.getBoard();
        const [x,y] = cords;
        return board[x][y] === 0;
    }
}