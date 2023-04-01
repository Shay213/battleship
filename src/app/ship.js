export const Ship = (length, vertical, boardCords) => {
    let hitCount = 0;
    const hit = () => hitCount++;
    const getHit = () => hitCount;
    const isSunk = () => length <= hitCount;
    const getCords = () => boardCords;
    return {hit, getHit, isSunk, getCords};
};