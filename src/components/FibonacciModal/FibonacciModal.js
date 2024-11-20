import {Modal} from "../../reusable-components/Modal";


export const FibonacciModal = ({modalIsOpen, emoji, handleStart}) => {
    return (
        <Modal isOpen={modalIsOpen}>
            <Modal.BigEmoji>{emoji}</Modal.BigEmoji>
            <Modal.Header> {"Welcome to Fibonacci: The Grid Puzzle Game!"} </Modal.Header>
            <Modal.Description> {`Get ready to dive into the strategic and mathematical world of Fibonacci!`} </Modal.Description>
            <Modal.Body> {"In this strategic puzzle, your goal is to clear the grid by forming patterns of 5 consecutive Fibonacci numbers in a row or column. Start with a 50x50 grid and click a cell to increment its value by 1—along with all other cells in the same row and column. Empty cells become 1. Align Fibonacci numbers (e.g., 1, 1, 2, 3, 5), and those cells will clear, making space for new moves.\n" +
                "\n" +
                "Plan wisely, set up chain reactions, and aim for the highest score. Good luck!"} </Modal.Body>
            <Modal.Footer handleClose={handleStart}> Start </Modal.Footer>
        </Modal>
    );
}