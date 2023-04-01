export const validateCords = cords => {
    if(!Array.isArray(cords)) return 'cords must be an array';
    const [x,y] = cords;
    if(!Number.isInteger(x) || !Number.isInteger(y) || cords.length > 2) return 'cords must be an array and contain pair of integers';
    return false;
};