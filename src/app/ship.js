export const Ship = (length, vertical, boardCords) => {
    let hitCount = 0;
    const hit = () => hitCount++;
    const getHit = () => hitCount;
    const isSunk = () => length <= hitCount;

    return {hit, getHit, isSunk};
};