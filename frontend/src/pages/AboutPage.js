// src/pages/AboutPage.js
import { useState, useEffect } from 'react';


// --- MUSIC MEMORY GAME COMPONENT ---
const musicEmojis = ['🎸', '🎹', '🥁', '🎤', '🎧', '🎺', '🎻', '🎷'];

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'won', 'lost'

  // Initialize and shuffle the game
  const startGame = () => {
    const shuffledCards = [...musicEmojis, ...musicEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
    
    setCards(shuffledCards);
    setMoves(0);
    setTimeLeft(60);
    setFlippedIndices([]);
    setGameState('playing');
  };

  // Timer Effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('lost');
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Handle Card Click
  const handleCardClick = (index) => {
    // Prevent clicking if game is over, card is already flipped, or 2 cards are already flipping
    if (gameState !== 'playing' || cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;

    const newIndices = [...flippedIndices, index];
    setFlippedIndices(newIndices);

    // Flip the selected card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    // Check for a match if 2 cards are flipped
    if (newIndices.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newIndices;
      
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        // MATCH!
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        
        // Check win condition
        if (newCards.every(c => c.isMatched)) {
          setGameState('won');
        }
      } else {
        // NO MATCH - Flip them back after 1 second
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-wrapper" style={{ textAlign: 'center', padding: '20px', background: 'rgba(0, 18, 51, 0.5)', borderRadius: '15px', border: '1px solid #00B4D8' }}>
      <h2 style={{ marginBottom: '10px', color: '#00B4D8' }}>🎧 Music Memory Game 🎧</h2>
      <p style={{ opacity: 0.9, marginBottom: '20px' }}>Find all the matching pairs before time runs out!</p>

      {/* Game Stats */}
      <div className="game-stats" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        <span>Moves: {moves}</span>
        <span style={{ color: timeLeft <= 10 ? '#ff4d4d' : 'inherit' }}>Time: {timeLeft}s</span>
      </div>

      {/* Game Board */}
      {gameState === 'idle' ? (
        <button onClick={startGame} className="primary-btn" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Play Game</button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
          {cards.map((card, index) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                height: '80px',
                background: card.isFlipped || card.isMatched ? '#F8F9FA' : '#00B4D8',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                cursor: card.isMatched ? 'default' : 'pointer',
                transition: 'transform 0.3s, background 0.3s',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              <span style={{ transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {(card.isFlipped || card.isMatched) ? card.emoji : '🎵'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Game Over / Win Messages */}
      {gameState === 'won' && (
        <div style={{ marginTop: '20px', color: '#00d873', fontWeight: 'bold', fontSize: '1.5rem' }}>
          <p>CONGRATULATIONS! YOU WIN! 🎉</p>
          <button onClick={startGame} className="primary-btn" style={{ marginTop: '10px' }}>Play Again</button>
        </div>
      )}
      
      {gameState === 'lost' && (
        <div style={{ marginTop: '20px', color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.5rem' }}>
          <p>GAME OVER ⏰ Time ran out!</p>
          <button onClick={startGame} className="primary-btn" style={{ marginTop: '10px' }}>Try Again</button>
        </div>
      )}

      {/* Reset Button (Only show while playing) */}
      {gameState === 'playing' && (
        <button onClick={startGame} className="theme-btn" style={{ marginTop: '25px' }}>Reset Game</button>
      )}
    </div>
  );
}

// --- MAIN ABOUT PAGE COMPONENT ---
function AboutPage({ theme, toggleTheme }) {
  return (
    <div className="about-page">
      

      <main>
        <section className="about-section">
          <div className="about-grid">
            <div className="text">
              <h1>ABOUT <span className="blue-me">me</span></h1>
              <h2>Discover more of myself</h2>
              <p>
                My name is Justin Rain R. Labiaga, a 20 year old from San Benito Norte, Aringay, La Union. I enjoy playing the guitar because it helps me relax and express my emotions. Music is an important part of my life, and I continue to grow by learning new things and improving myself every day.
              </p>
            </div>
            <div className="about-image-container">
              <img src="/images/me.jpg" alt="Justin's " style={{ borderRadius: '15px', width: '100%' }} />
            </div>
          </div>
        </section>

        <section className="about-section alternate">
          <div className="about-grid">
            <div className="about-image-container">
              <img src="/images/guitar.jpg" alt="Music equipment setup" style={{ borderRadius: '15px', width: '100%' }} />
            </div>
            <div className="text">
              <h1>PROGRESS <span className="blue-title">Journey</span></h1>
              <h2>My Journey With Music</h2>
              <p>
                My interest in music started out of curiosity. Over time, I began learning how to play the acoustic guitar and practiced basic chords and strumming patterns. As I became more comfortable, I explored electric guitar and learned simple techniques. Even though I am still learning, music has become an important part of my daily life and personal growth.
              </p>
            </div>
          </div>
        </section>

        <section className="timeline-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div className="timeline">
            <h3 style={{ marginBottom: '20px', color: '#00B4D8' }}>Learning Timeline</h3>
            <ol style={{ listStylePosition: 'inside', textAlign: 'left', maxWidth: '400px', margin: '0 auto', lineHeight: '2' }}>
              <li>Developed an interest in music</li>
              <li>Learned basic guitar chords</li>
              <li>Practiced acoustic guitar regularly</li>
              <li>Explored electric guitar and simple techniques</li>
            </ol>
          </div>
        </section>

        <section className="quote-section" style={{ padding: '40px 20px', textAlign: 'center', fontStyle: 'italic', opacity: 0.8 }}>
          <blockquote>
            “Where words fail, music speaks.”
          </blockquote>
        </section>

        {/* --- OUR NEW REACT MEMORY GAME GOES HERE --- */}
        <section className="game-section" style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
          <MemoryGame />
        </section>
        
      </main>

      
    </div>
  );
}

export default AboutPage;