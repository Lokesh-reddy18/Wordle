# Wordle Game

[![Deploy on Vercel](https://vercel.com/button)](https://wordle18.vercel.app/)

**Live Demo:** [https://wordle18.vercel.app/](https://wordle18.vercel.app/)

A modern implementation of the popular word-guessing game Wordle, built with React.js. This version features a clean, responsive design with smooth animations and a dark/light theme toggle.

![Wordle Game](public/favicon.svg)

## Features

- 🎯 Clean, modern UI with smooth animations
- 🌓 Dark/Light theme toggle
- ⌨️ Full keyboard support (both physical and on-screen)
- 📱 Responsive design that works on all devices
- 🎨 Beautiful background animations
- 🎮 Intuitive gameplay with visual feedback
- 🎉 Win/lose state handling
- 💫 Smooth tile animations and transitions

## How to Play

1. The game randomly selects a 5-letter word
2. You have 6 attempts to guess the word
3. After each guess:
   - 🟩 Green tile: Correct letter in correct position
   - 🟨 Yellow tile: Correct letter in wrong position
   - ⬜ Gray tile: Letter not in the word
4. Use the on-screen keyboard or your physical keyboard to make guesses
5. Press Enter to submit your guess
6. Press Backspace to delete letters

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wordle.git
cd wordle
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technologies Used

- React.js
- Emotion (for styled components)
- Framer Motion (for animations)
- Modern JavaScript (ES6+)

## Project Structure

```
wordle/
├── public/
│   ├── favicon.svg
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── Game.js
│   ├── words.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the original Wordle game
- Built with Create React App
- Uses modern web technologies for the best user experience
