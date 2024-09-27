import React, { useState, useEffect } from 'react';
import './App.css';
import jingleBells from './jinglebells.mp3'; // Aggiungi qui il file mp3
import christmasTree from './christmas.jpeg'; // Aggiungi qui l'immagine natalizia

const App = () => {
  const [timeUntilChristmas, setTimeUntilChristmas] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
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

  return (
    <div className="App">
      <h1 style={{ fontSize: '2.5rem', color: '#ff0000' }}>🎄 Christmas Holidays Countdown🎄</h1>

      <img src={christmasTree} alt="Christmas Tree" className="christmas-tree" />

      <div className="countdown">
        <div className="time-block">
          <span className="time">{timeUntilChristmas.days}</span>
          <span className="label">Days</span>
        </div>
        <div className="time-block">
          <span className="time">{timeUntilChristmas.hours}</span>
          <span className="label">Hours</span>
        </div>
        <div className="time-block">
          <span className="time">{timeUntilChristmas.minutes}</span>
          <span className="label">Minutes</span>
        </div>
        <div className="time-block">
          <span className="time">{timeUntilChristmas.seconds}</span>
          <span className="label">Seconds</span>
        </div>
      </div>

      {/* Nascondere il riproduttore musicale, ma far partire la musica in automatico */}
      <audio src={jingleBells} autoPlay loop style={{ display: 'none' }} />

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