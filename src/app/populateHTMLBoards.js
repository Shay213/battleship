export const populateHTMLBoards = () => {
    const boards = document.querySelectorAll('.board');
    for(let i=0; i<100; i++){
        boards.forEach(board => board.appendChild(document.createElement('div')));
    }
};