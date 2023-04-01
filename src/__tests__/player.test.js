import { Player } from "../app/player";
import { GameBoard } from "../app/gameboard";

const gameBoard = GameBoard();
const newPlayer = new Player('player1', gameBoard);

test('playTurn should receive array', () => {
    expect(() => newPlayer.playTurn()).toThrow('cords must be an array');
    expect(() => newPlayer.playTurn('1,1')).toThrow('cords must be an array');
    expect(() => newPlayer.playTurn([1,'1'])).toThrow('cords must be an array and contain pair of integers');
    expect(() => newPlayer.playTurn([1,1,1])).toThrow('cords must be an array and contain pair of integers');
    expect(() => newPlayer.playTurn([8,2])).not.toThrow();
});