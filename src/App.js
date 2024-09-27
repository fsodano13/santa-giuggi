import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './App.css';
import jingleBells from './jingleBells.mp3';
import silentNight from './silentNight.mp3';
import weWishYouAMerryChristmas from './weWishYouAMerryChristmas.mp3';
import giuggi from './giuggi.jpeg';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';

const App = () => {
  const [timeUntilChristmas, setTimeUntilChristmas] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSongName, setCurrentSongName] = useState('');
  const audioRef = useRef(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const christmasSongs = useMemo(() => [
    { src: jingleBells, name: 'Jingle Bells' },
    { src: silentNight, name: 'Silent Night' },
    { src: weWishYouAMerryChristmas, name: 'We Wish You a Merry Christmas' }
  ], []);

  const handleSongEnd = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % christmasSongs.length);
  }, [christmasSongs]);

  useEffect(() => {
    setCurrentSongName(christmasSongs[currentSongIndex].name);
  }, [currentSongIndex, christmasSongs]);

  useEffect(() => {
    const audio = new Audio(christmasSongs[currentSongIndex].src);
    audio.addEventListener('canplaythrough', () => setAudioLoaded(true));
    audio.addEventListener('ended', handleSongEnd);
    audioRef.current = audio;

    if (isPlaying) {
      audio.play().catch(error => console.error("Playback error:", error));
    }

    return () => {
      audio.removeEventListener('canplaythrough', () => setAudioLoaded(true));
      audio.removeEventListener('ended', handleSongEnd);
      audio.pause();
    };
  }, [christmasSongs, currentSongIndex, handleSongEnd, isPlaying]);

  useEffect(() => {
    const calculateTimeUntilChristmas = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      const christmasDate = new Date(currentYear, 11, 20, 13, 25); // 20 dicembre alle 13:25
      if (now > christmasDate) {
        christmasDate.setFullYear(currentYear + 1);
      }

      const difference = christmasDate - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeUntilChristmas({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    calculateTimeUntilChristmas();
    const interval = setInterval(calculateTimeUntilChristmas, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMusic = async () => {
    if (audioRef.current && audioLoaded && !isLoading) {
      setIsLoading(true);
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Playback error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => 
      (prevIndex - 1 + christmasSongs.length) % christmasSongs.length
    );
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % christmasSongs.length);
  };

  const generateSnowflakes = () => {
    const snowflakes = [];
    const numberOfSnowflakes = 50; // Puoi regolare questo numero

    for (let i = 0; i < numberOfSnowflakes; i++) {
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 10 + 5}s`; // Da 5 a 15 secondi
      const opacity = Math.random() * 0.5 + 0.5; // Aumenta l'opacità minima
      const fontSize = `${Math.random() * 20 + 10}px`; // Da 10px a 30px

      snowflakes.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left,
            top: '-20px',
            fontSize,
            opacity,
            color: 'white', // Imposta il colore a bianco
            animation: `fall ${animationDuration} linear infinite`,
          }}
        >
          ❄
        </div>
      );
    }

    return snowflakes;
  };

  // Effetto neve
  const createSnowflakes = () => {
    const snowflakes = [];
    const numberOfSnowflakes = 50;

    for (let i = 0; i < numberOfSnowflakes; i++) {
      snowflakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`
          }}
        >
          ❄
        </div>
      );
    }

    return snowflakes;
  };

  return (
    <>
      {createSnowflakes()}
      <div className="App">
        <h1 className="app-title">
          🎄 Christmas Holidays 🎄
        </h1>

        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-value">{timeUntilChristmas.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeUntilChristmas.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeUntilChristmas.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeUntilChristmas.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>

        <div className="music-controls">
          <button onClick={prevSong} className="control-button">
            <FaStepBackward />
          </button>
          <img 
            src={giuggi} 
            alt="Christmas Tree" 
            className={`christmas-tree ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={toggleMusic}
          />
          <button onClick={nextSong} className="control-button">
            <FaStepForward />
          </button>
        </div>

        <div className="song-name">{currentSongName}</div>

        {/* Fiocchi di neve */}
        <div className="snowflakes">
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {generateSnowflakes()}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;