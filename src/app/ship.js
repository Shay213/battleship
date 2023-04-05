export const Ship = (length, vertical, boardCords) => {
    let hitCount = 0;
    const hit = () => hitCount++;
    const getHit = () => hitCount;
    const isSunk = () => length <= hitCount;
    const getCords = () => boardCords;
    const isVertical = () => vertical;
    const getLength = () => length;
    const updateBoardCords = cords => boardCords = cords; 
    const setIsVertical = isVertical => vertical = isVertical; 
    return {hit, getHit, isSunk, getCords, isVertical, getLength, updateBoardCords, setIsVertical};
};