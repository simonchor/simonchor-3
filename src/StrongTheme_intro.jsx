import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Card, Typography } from "@mui/material";
import { useLocation } from 'react-router-dom';
import "./Home_style.css";

function StrongTheme_Intro() {
  const [cards, setCards] = useState([]);
  const cardRefs = useRef({}); // Reference to card elements
  const location = useLocation();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/themes'); // Fetch data from your backend
        setCards(response.data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };
    fetchCardData();
  }, []);

  useEffect(() => {
    if (location.state?.cardName) {
      const cardName = location.state.cardName;
      // Ensure cardName exists in cardRefs.current
      if (cardRefs.current[cardName]) {
        cardRefs.current[cardName].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.state, cards]); // Add cards to the dependency array

  return (
    <Box className='context-style'>
      {cards.map(card => (
        <Card
          key={card._id}
          elevation={3}
          className='strong-theme'
          ref={el => cardRefs.current[card.cardName] = el} // Set ref for each card
        >
          <div className="card-container">
            <Typography variant="h5">{card.cardName}</Typography>
            <img src={card.deckImage} alt={card.cardName} className="theme-card-image" />
            <Typography><strong>Deck Name:</strong> {card.deckname}</Typography>
            <Typography><strong>Comment:</strong> {card.comment}</Typography>
          </div>
        </Card>
      ))}
    </Box>
  );
}

export default StrongTheme_Intro;
