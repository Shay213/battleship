export const Ship = (length, vertical, boardCords) => {
    let hitCount = 0;
    const hit = () => hitCount++;
    const getHit = () => hitCount;
    const isSunk = () => length <= hitCount;
    const getCords = () => boardCords;
    const isVertical = () => vertical;
    const getLength = () => length;
    return {hit, getHit, isSunk, getCords, isVertical, getLength};
};