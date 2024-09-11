import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';

const cardNames = [
  "Snake-Eyes Flamberge Dragon",
  "Sangenpai Transcendent Dragion",
  "Spirit of Yubel",
  "Mementomictlan Tecuhtlica - Creation King",
  "Centur-Ion Primera",
  "Ritual Beast Ulti-Nochiudrago",
  "Rescue-ACE Turbulence"
];

const fetchCardData = async (cardName) => {
  try {
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${cardName}`);
    const data = await response.json();
    return data.data[0].card_images[0].image_url;
  } catch (error) {
    console.error(`Error fetching data for ${cardName}: `, error);
    return null;
  }
};

const Carousel_2 = () => {
  const [current, setCurrent] = useState(0);
  const [cardImages, setCardImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const images = await Promise.all(cardNames.map(name => fetchCardData(name)));
      setCardImages(images.filter(image => image !== null));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current => (current === cardImages.length - 1 ? 0 : current + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [cardImages.length]);

  const nextSlide = () => {
    setCurrent(current === cardImages.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? cardImages.length - 1 : current - 1);
  };

  const handleCardClick = (cardName) => {
    navigate('/strong_theme_intro', { state: { cardName } });
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Recent Strong Themes</h2>
      <div className="carousel-slider">
        <button className="carousel-button left" onClick={prevSlide}>❮</button>
        {cardImages.map((image, index) => (
          <div
            className={`carousel-slide ${index === current ? 'active' : ''}`}
            key={index}
            onClick={() => handleCardClick(cardNames[index])}
          >
            {index === current && (
              <img src={image} alt={`Card ${index}`} className="carousel-image" />
            )}
          </div>
        ))}
        <button className="carousel-button right" onClick={nextSlide}>❯</button>
      </div>
      <div className="carousel-dots">
        {cardImages.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel_2;