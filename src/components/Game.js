import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { WORDS } from '../words';

const BackgroundAnimation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: ${props => props.theme === 'dark' ? '#121213' : '#ffffff'};
`;

const FloatingTile = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 2px solid ${props => props.theme === 'dark' ? 'rgba(58, 58, 60, 0.3)' : 'rgba(211, 214, 218, 0.3)'};
  border-radius: 4px;
  background-color: ${props => {
    const colors = props.theme === 'dark' 
      ? ['rgba(83, 141, 78, 0.1)', 'rgba(181, 159, 59, 0.1)', 'rgba(58, 58, 60, 0.1)']
      : ['rgba(83, 141, 78, 0.05)', 'rgba(181, 159, 59, 0.05)', 'rgba(120, 124, 126, 0.05)'];
    return colors[Math.floor(Math.random() * colors.length)];
  }};
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(10px, 2vw, 20px);
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background-color: transparent;
  color: ${props => props.theme === 'dark' ? 'white' : '#121213'};
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: clamp(1.2rem, 4vw, 2rem);
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  color: ${props => props.theme === 'dark' ? 'white' : '#121213'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ThemeToggle = styled(motion.button)`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? 'white' : '#121213'};
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f0f0f0'};
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: clamp(2px, 0.8vw, 4px);
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  width: 100%;
  max-width: 500px;
  padding: 0 10px;
  flex-shrink: 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(2px, 0.8vw, 4px);
`;

const Tile = styled(motion.div)`
  width: clamp(35px, 10vw, 50px);
  height: clamp(35px, 10vw, 50px);
  border: 2px solid ${props => props.theme === 'dark' ? '#3a3a3c' : '#d3d6da'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${props => {
    if (props.status === 'correct') return '#538d4e';
    if (props.status === 'present') return '#b59f3b';
    if (props.status === 'absent') return props.theme === 'dark' ? '#3a3a3c' : '#787c7e';
    return 'transparent';
  }};
  color: ${props => props.theme === 'dark' ? 'white' : '#121213'};
`;

const Keyboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 1vw, 6px);
  width: 100%;
  max-width: 500px;
  padding: 0 10px;
  margin-top: auto;
  margin-bottom: clamp(10px, 2vw, 20px);
`;

const KeyboardRow = styled.div`
  display: flex;
  gap: clamp(2px, 0.8vw, 4px);
  justify-content: center;
  width: 100%;
`;

const Key = styled(motion.button)`
  min-width: clamp(20px, 6vw, 35px);
  height: clamp(35px, 10vw, 50px);
  border-radius: 4px;
  border: none;
  background-color: ${props => props.theme === 'dark' ? '#818384' : '#d3d6da'};
  color: ${props => props.theme === 'dark' ? 'white' : '#121213'};
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 2vw, 1rem);
  padding: 0;
  flex: 1;
  max-width: ${props => props.isSpecial ? '65px' : '35px'};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#9e9e9e' : '#c0c3c7'};
  }

  @media (max-width: 480px) {
    min-width: ${props => props.isSpecial ? '50px' : '20px'};
    font-size: ${props => props.isSpecial ? '0.7rem' : '0.8rem'};
  }
`;

const Message = styled(motion.div)`
  color: ${props => props.type === 'error' ? '#ff0000' : '#538d4e'};
  margin-bottom: clamp(0.3rem, 1vw, 0.5rem);
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  font-weight: bold;
  text-align: center;
  padding: 0 10px;
  max-width: 500px;
  height: clamp(20px, 3vw, 30px);
`;

const Game = () => {
  const [targetWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [theme, setTheme] = useState('dark');

  // Generate random positions for background tiles
  const generateBackgroundTiles = () => {
    const tiles = [];
    const numTiles = 20;
    const sizes = [20, 25, 30, 35];

    for (let i = 0; i < numTiles; i++) {
      tiles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        duration: 20 + Math.random() * 30,
        delay: Math.random() * 5
      });
    }
    return tiles;
  };

  const [backgroundTiles] = useState(generateBackgroundTiles);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const checkGuess = (guess) => {
    const result = Array(5).fill('absent');
    const targetArray = targetWord.split('');
    const guessArray = guess.split('');

    // Check for correct letters
    guessArray.forEach((letter, i) => {
      if (letter === targetArray[i]) {
        result[i] = 'correct';
        targetArray[i] = null;
      }
    });

    // Check for present letters
    guessArray.forEach((letter, i) => {
      if (result[i] !== 'correct' && targetArray.includes(letter)) {
        result[i] = 'present';
        targetArray[targetArray.indexOf(letter)] = null;
      }
    });

    return result;
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (guesses[currentRow].length !== 5) {
        setMessage('Word must be 5 letters long');
        setMessageType('error');
        return;
      }
      if (!WORDS.includes(guesses[currentRow])) {
        setMessage('Not in word list');
        setMessageType('error');
        return;
      }

      if (guesses[currentRow] === targetWord) {
        setGameOver(true);
        setMessage('Congratulations! You won! 🎉');
        setMessageType('success');
      } else if (currentRow === 5) {
        setGameOver(true);
        setMessage(`Game over! The word was ${targetWord}`);
        setMessageType('error');
      } else {
        setCurrentRow(prev => prev + 1);
      }
    } else if (key === 'BACKSPACE') {
      setGuesses(prev => {
        const newGuesses = [...prev];
        newGuesses[currentRow] = newGuesses[currentRow].slice(0, -1);
        return newGuesses;
      });
    } else if (guesses[currentRow].length < 5) {
      setGuesses(prev => {
        const newGuesses = [...prev];
        newGuesses[currentRow] = newGuesses[currentRow] + key;
        return newGuesses;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow, guesses, gameOver]);

  const renderTile = (rowIndex, colIndex) => {
    const letter = guesses[rowIndex][colIndex] || '';
    const status = rowIndex < currentRow ? checkGuess(guesses[rowIndex])[colIndex] : '';

    return (
      <Tile
        key={`${rowIndex}-${colIndex}`}
        status={status}
        theme={theme}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          rotate: status ? [0, 10, -10, 0] : 0
        }}
        transition={{ 
          duration: 0.2,
          rotate: { duration: 0.3 }
        }}
      >
        {letter}
      </Tile>
    );
  };

  return (
    <>
      <BackgroundAnimation theme={theme}>
        {backgroundTiles.map((tile) => (
          <FloatingTile
            key={tile.id}
            theme={theme}
            size={tile.size}
            initial={{ 
              x: `${tile.x}vw`, 
              y: `${tile.y}vh`,
              opacity: 0 
            }}
            animate={{ 
              x: [`${tile.x}vw`, `${tile.x + 10}vw`, `${tile.x}vw`],
              y: [`${tile.y}vh`, `${tile.y + 10}vh`, `${tile.y}vh`],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: tile.duration,
              delay: tile.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </BackgroundAnimation>
      <GameContainer theme={theme}>
        <Title theme={theme}>
          Wordle
          <ThemeToggle
            theme={theme}
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </ThemeToggle>
        </Title>
        <AnimatePresence>
          {message && (
            <Message
              type={messageType}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </Message>
          )}
        </AnimatePresence>
        <Board>
          {Array(6).fill().map((_, rowIndex) => (
            <Row key={rowIndex}>
              {Array(5).fill().map((_, colIndex) => renderTile(rowIndex, colIndex))}
            </Row>
          ))}
        </Board>
        <Keyboard>
          {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rowIndex) => (
            <KeyboardRow key={rowIndex}>
              {row.split('').map(key => (
                <Key
                  key={key}
                  theme={theme}
                  onClick={() => handleKeyPress(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key}
                </Key>
              ))}
              {rowIndex === 2 && (
                <>
                  <Key
                    theme={theme}
                    onClick={() => handleKeyPress('BACKSPACE')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    isSpecial
                  >
                    ⌫
                  </Key>
                  <Key
                    theme={theme}
                    onClick={() => handleKeyPress('ENTER')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    isSpecial
                  >
                    Enter
                  </Key>
                </>
              )}
            </KeyboardRow>
          ))}
        </Keyboard>
      </GameContainer>
    </>
  );
};

export default Game; 