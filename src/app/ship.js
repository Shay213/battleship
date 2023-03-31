export const Ship = length => {
    let hitCount = 0;
    const hit = () => hitCount++;
    const getHit = () => hitCount;
    const isSunk = () => length <= hitCount;
    const getLength = () => length;
    
    return {hit, getHit, isSunk, getLength};
};