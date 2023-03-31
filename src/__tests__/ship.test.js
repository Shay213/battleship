import { Ship } from "../app/ship";

test('Ship should receive a number, boolean, and array', () => {
    const arg1 = 1;
    const arg2 = false;
    const arg3 = [[0,1]]
    Ship(arg1, arg2, arg3);
    expect(arg1).toEqual(expect.any(Number));
    expect(arg2).toEqual(expect.any(Boolean));
    expect(arg3).toEqual(expect.any(Array));
});

test('hit increase hitCount by 1', () => {
    const ship1 = Ship(1);
    ship1.hit();
    expect(ship1.getHit()).toBe(1);
});

test('sunk to be true if length <= hitCount', () => {
    const ship2 = Ship(2);
    ship2.hit();
    ship2.hit();
    expect(ship2.isSunk()).toBeTruthy();
});
