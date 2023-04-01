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