import { Ship } from "../app/ship";

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