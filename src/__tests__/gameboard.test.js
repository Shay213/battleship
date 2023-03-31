import { GameBoard } from "../app/gameboard";

const gameBoard = GameBoard();

describe('placing ships on the board', () => {

    const board = gameBoard.getBoard(); 

    test('placeShip should receive array and optional object', () => {
        expect(() => gameBoard.placeShip()).toThrow('cords must be an array');
        expect(() => gameBoard.placeShip('1,1')).toThrow('cords must be an array');
        expect(() => gameBoard.placeShip([1,'1'])).toThrow('cords must be an array and contain pair of integers');
        expect(() => gameBoard.placeShip([1,1,1])).toThrow('cords must be an array and contain pair of integers');
        expect(() => gameBoard.placeShip([8,2])).not.toThrow();
        expect(() => gameBoard.placeShip([9,9], {length: 1})).not.toThrow();
        expect(() => gameBoard.placeShip([8,0], {length: 1, vertical: true})).not.toThrow();
        expect(() => gameBoard.placeShip([8,1], 'length')).toThrow('options must be an object');
    });

    test('Mark square on board as taken based on received cords', () => {
        gameBoard.placeShip([7,7]);
        expect(board[7][7]).toBe(1);
    });


    test('check if received square is valid or taken', () => {
        expect(() => gameBoard.placeShip([7, 7])).toThrow();
        expect(() => gameBoard.placeShip([10, 10])).toThrow();
    });

    describe('testing horizontal ships', () => {
        test('mark multiple squares if ship length > 1', () => {
            gameBoard.placeShip([0, 0], {length: 4});
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
            gameBoard.placeShip([0, 5], {length: 4, vertical: true});
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