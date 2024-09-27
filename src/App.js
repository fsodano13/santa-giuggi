import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import jingleBells from './jinglebells.mp3'; // Aggiungi qui il file mp3
import silentNight from './silentnight.mp3';  // Aggiungi questo file
import weWishYouAMerryChristmas from './wewishyouamerrychristmas.mp3';  // Aggiungi questo file
import christmasTree from './christmas.jpeg'; // Aggiungi qui l'immagine natalizia

const App = () => {
  const [timeUntilChristmas, setTimeUntilChristmas] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  const christmasSongs = [jingleBells, silentNight, weWishYouAMerryChristmas];

  useEffect(() => {
    // Aggiungi questo effetto per cambiare il titolo della pagina
    document.title = "Santa Giuggi";

    const calculateTimeUntilChristmas = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const christmasDate = new Date(currentYear, 11, 20, 13, 25); // Dicembre, 13:25

      if (today > christmasDate) {
        christmasDate.setFullYear(currentYear + 1); // Se Natale è già passato, calcola per l'anno successivo
      }

      const timeDifference = christmasDate - today;

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      setTimeUntilChristmas({ days, hours, minutes, seconds });
    };

    calculateTimeUntilChristmas();
    const interval = setInterval(calculateTimeUntilChristmas, 1000); // Aggiorna ogni secondo

    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
  }, []);

  // Funzione per generare fiocchi di neve
  const generateSnowflakes = () => {
    const snowflakes = [];
    for (let i = 0; i < 50; i++) {
      snowflakes.push(
        <div 
          key={i} 
          className="snowflake" 
          style={{
            left: `${Math.random() * 100}vw`, 
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      );
    }
    return snowflakes;
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Cambia la canzone
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % christmasSongs.length);
        audioRef.current.src = christmasSongs[currentSongIndex];
        audioRef.current.play().catch(error => {
          console.log("Playback prevented:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="App">
      <h1 style={{ 
        fontSize: '1.2rem', 
        color: '#ff0000', 
        lineHeight: '1.1',
      }}>
        🎄 Christmas Holidays Countdown 🎄
      </h1>

      <img 
        src={christmasTree} 
        alt="Christmas Tree" 
        className="christmas-tree" 
        style={{ 
          maxWidth: '70%', 
          height: 'auto', 
          maxHeight: '40vh',
          cursor: 'pointer',
          border: isPlaying ? '3px solid gold' : 'none', // Feedback visivo
        }} 
        onClick={toggleMusic} // Aggiunge l'evento onClick
      />

      <div className="countdown" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
          <div key={unit} className="time-block" style={{ margin: '3px', minWidth: '50px' }}>
            <span className="time" style={{ fontSize: '1.3rem' }}>{timeUntilChristmas[unit]}</span>
            <span className="label" style={{ fontSize: '0.7rem' }}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
          </div>
        ))}
      </div>

      {/* Nascondere il riproduttore musicale, ma far partire la musica in automatico */}
      <audio ref={audioRef} src={christmasSongs[currentSongIndex]} loop />

      {/* Fiocchi di neve */}
      <div className="snowflakes">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {generateSnowflakes()}
        </div>
      </div>
    </div>
  );
};

export default App;