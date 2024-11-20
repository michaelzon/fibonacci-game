import './Header.css';

export const Header = ({score}) => {
    return (
        <header>
            <div className="score-display">
                <h2>Score: {score}</h2>
            </div>
            <a className={"link"} href="https://github.com/michaelzon/fibonacci-game">View on
                GitHub</a>
        </header>
    )
}