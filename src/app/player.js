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
        this.hitShipCords = null;
        this.movesToMake = [];
    }

    playTurn(){
        let cords;
        if(this.hitShipCords){
            cords = this.hitAndTargetMode();
            if(!cords){
                cords = this.generateValidMove();
            }
        }else{
            cords = this.generateValidMove();
        }
        const [x, y] = cords;
        const hitShip = this.enemyGameBoard.getBoard()[x][y] === 1;
        if(hitShip){
            this.hitShipCords = cords;
        }
        this.enemyGameBoard.receiveAttack(cords);
        return cords;
    }
      

    hitAndTargetMode(){
        const [x,y] = this.hitShipCords;
        const ship = this.enemyGameBoard.getShips().find(ship => ship.getCords().find(cord => JSON.stringify(cord) === JSON.stringify(this.hitShipCords)));
        const isHit = cord => this.enemyGameBoard.getBoard()[cord[0]][cord[1]] === 1;
        let moves = [];
        if(ship){
            if(ship.isVertical()){
                if(x-1 >= 0 && this.isValidMove([x-1, y])) moves.push([x-1, y]);
                if(x+1 < 10 && this.isValidMove([x+1, y])) moves.push([x+1, y]);
            }else{
                if(y-1 >= 0 && this.isValidMove([x, y-1])) moves.push([x, y-1]);
                if(y+1 < 10 && this.isValidMove([x, y+1])) moves.push([x, y+1]); 
            }
        }
        
        const hitMoves = moves.filter(cord => isHit(cord));
        this.movesToMake = [...this.movesToMake, ...hitMoves];
        if(this.movesToMake.length > 0){
            return this.movesToMake.shift();
        }
        else{
            this.hitShipCords = null;
            return this.generateValidMove();
        }
    }

    generateValidMove(){
        const cords = this.generateRandomCords();
        return this.isValidMove(cords) ? cords : this.generateValidMove();
    }

    generateRandomCords(){
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return [x,y];
    }
}