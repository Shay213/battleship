import { GameBoard } from "../app/gameboard";

const gameBoard = GameBoard();

describe('placing ships on the board', () => {

    test('Mark square on board as taken based on received cords', () => {
        gameBoard.placeShip([7,7]);
        const board = gameBoard.getBoard();
        expect(board[7][7]).toBe(1);
    });


    test('check if received square is valid or taken', () => {
        expect(() => gameBoard.placeShip([7, 7])).toThrow();
        expect(() => gameBoard.placeShip([10, 10])).toThrow();
    });

    describe('testing horizontal ships', () => {
        test('mark multiple squares if ship length > 1', () => {
            gameBoard.placeShip([0, 0], {length: 4});
            const board = gameBoard.getBoard();
            expect(board[0][0]).toBe(1);
            expect(board[0][1]).toBe(1);
            expect(board[0][2]).toBe(1);
            expect(board[0][3]).toBe(1);
        });
        
        test('check if ship with length > 1 will fit', () => {
            expect(() => gameBoard.placeShip([0, 7], {length: 4})).toThrow();
        });
        
        test('ships separated by 1 square', () => {
            const length = 3;
            expect(() => gameBoard.placeShip([0, 4], {length: length})).toThrow();
            expect(() => gameBoard.placeShip([1, 4], {length: length})).toThrow();
            expect(() => gameBoard.placeShip([1, 0], {length: length})).toThrow();
        });
    });

    describe('testing vertical ships', () => {
        test('mark multiple squares if ship length > 1', () => {
            console.log(gameBoard.getBoard());
            gameBoard.placeShip([0, 5], {length: 4, vertical: true});
            const board = gameBoard.getBoard();
            expect(board[0][5]).toBe(1);
            expect(board[1][5]).toBe(1);
            expect(board[2][5]).toBe(1);
            expect(board[3][5]).toBe(1);
        });
        
        test('check if ship with length > 1 will fit', () => {
            expect(() => gameBoard.placeShip([7, 0], {length: 4, vertical: true})).toThrow();
        });
        
        test('ships separated by 1 square', () => {
            const length = 3;
            expect(() => gameBoard.placeShip([0, 6], {length: length, vertical: true})).toThrow();
            expect(() => gameBoard.placeShip([1, 4], {length: length, vertical: true})).toThrow();
            expect(() => gameBoard.placeShip([4, 4], {length: length})).toThrow();
        });
    });

});