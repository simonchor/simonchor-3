import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Card, Typography } from "@mui/material";
import { useLocation } from 'react-router-dom';
import "./Home_style.css"; // 保留现有样式

function StrongCard_Intro() {
  const [cards, setCards] = useState([]);
  const cardRefs = useRef({}); // Reference to card elements
  const location = useLocation();

  useEffect(() => {
    // 从数据库获取卡片数据
    const fetchCardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/strongcards'); // Fetch data from your backend
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
          key={card._id} // 使用数据库中的 _id 作为 key
          elevation={3}
          className='strong-card'
          ref={el => cardRefs.current[card.cardName] = el} // Set ref for each card
        >
          <div className="card-container">
            <br /><br />
            <Typography variant="h5">{card.cardName}</Typography>
            <img src={card.strongcardImage} alt={card.cardName} className="card-image" /> {/* 从数据库中提取图片 */}
            <Typography><strong>Comment:</strong> {card.comment || "No comment available"}</Typography>
            <br /><br />
          </div>
        </Card>
      ))}
    </Box>
  );
}

export default StrongCard_Intro;
