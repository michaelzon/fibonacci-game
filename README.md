# Fibonacci: The Grid Puzzle Game

Welcome to **Fibonacci: The Grid Puzzle Game**, a strategic and mathematical puzzle where you clear the grid by aligning Fibonacci numbers. This project was implemented as part of a programming assignment and serves as an engaging introduction to game development, strategic planning, and React.
You can view and use the project live at https://fibonacci-game-two.vercel.app/
---

## 🧩 Game Instructions

Dive into the world of Fibonacci with this unique puzzle game! The rules are simple:
1. **Grid Setup**: Start with a **50x50 grid**.
2. **Incrementing Cells**:
    - Click on a cell to increment its value by 1.
    - All other cells in the **same row and column** will also increment by 1.
    - If a cell is empty, it is set to 1.
3. **Clearing Fibonacci Numbers**:
    - Align **5 consecutive Fibonacci numbers** in a row or column to clear them from the grid.
    - Fibonacci numbers include: `1, 1, 2, 3, 5, 8, 13, ...`.
4. **Scoring**:
    - Points are awarded based on the Fibonacci numbers you clear.
    - Plan wisely to set up chain reactions for higher scores.

### Objective

Clear the grid, maximize your score, and test your strategic thinking. Good luck!

---

## 🚀 Features

- **Dynamic Gameplay**: A 50x50 grid with responsive controls and real-time updates.
- **Strategic Mechanics**: Increment cells, align Fibonacci numbers, and plan chain reactions.
- **Score Tracking**: Earn points based on the cleared Fibonacci numbers.
- **Responsive UI**: Built with React for a seamless and interactive experience.
- **Customizable**: Easily scalable for different grid sizes or rules.

---

[//]: # (## 🛠️ Getting Started)

[//]: # ()
[//]: # (This project was bootstrapped with [Create React App]&#40;https://github.com/facebook/create-react-app&#41;.)

[//]: # ()
[//]: # (### Prerequisites)

[//]: # ()
[//]: # (Ensure you have **Node.js** and **npm** installed.)

[//]: # ()
[//]: # (### Installation)

[//]: # ()
[//]: # (1. Clone this repository:)

[//]: # (   ```bash)

[//]: # (   git clone <repository_url>)

[//]: # (   cd <repository_folder>)

[//]: # (   ```)

[//]: # (2. Install dependencies:)

[//]: # (   ```bash)

[//]: # (   npm install)

[//]: # (   ```)

[//]: # ()
[//]: # (### Running the Application)

[//]: # ()
[//]: # (1. Start the development server:)

[//]: # (   ```bash)

[//]: # (   npm start)

[//]: # (   ```)

[//]: # (2. Open [http://localhost:3000]&#40;http://localhost:3000&#41; in your browser.)

[//]: # ()
[//]: # (---)

[//]: # ()
[//]: # (## 📜 Scripts)

[//]: # ()
[//]: # (- **Start**: Run the app in development mode:)

[//]: # (  ```bash)

[//]: # (  npm start)

[//]: # (  ```)

[//]: # (- **Build**: Create an optimized production build:)

[//]: # (  ```bash)

[//]: # (  npm run build)

[//]: # (  ```)

[//]: # (- **Test**: Launch the test runner in watch mode:)

[//]: # (  ```bash)

[//]: # (  npm test)

[//]: # (  ```)

[//]: # (- **Eject**: Remove Create React App abstraction &#40;irreversible&#41;:)

[//]: # (  ```bash)

[//]: # (  npm run eject)

[//]: # (  ```)

[//]: # ()
[//]: # (---)

## ✨ Highlights of the Code

### Key Functionalities

- **Dynamic Fibonacci Detection**:
    - Automatically detects and clears 5 consecutive Fibonacci numbers in rows and columns.
    - Fibonacci detection is optimized for performance on a 50x50 grid.

- **Real-Time Score Updates**:
    - Score updates dynamically based on the Fibonacci numbers cleared.

- **CSS Animations**:
    - Cells animate when cleared, adding a visual flair to gameplay.

### Core Components

- **Modal**: A welcoming instruction modal to guide new players.
- **Game Logic**: Efficient handling of grid updates, Fibonacci checks, and cell clearing.
- **Responsive Grid**: A dynamically rendered 50x50 grid.

---

## 🧮 Fibonacci Logic Example

If the following row is present:

| 1 | 1 | 2 | 3 | 5 |  
|---|---|---|---|---|

The game detects the Fibonacci sequence (`1, 1, 2, 3, 5`) and clears it.

---


## 🔗 Resources

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/docs/getting-started/)
- [Fibonacci Sequence](https://en.wikipedia.org/wiki/Fibonacci_number)

---


