import React, { useState, useEffect } from "react";
import "./Home_style.css"; // Import the CSS file
import {  Paper,Box,Typography } from "@mui/material";

// Function to fetch card data from the API
const fetchCardData = async (cardName = "") => {
  try {
    const url = cardName
      ? `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${cardName}`
      : "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    const response = await fetch(url);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data; // Return all possible matches
    } else {
      throw new Error("Card not found");
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

// Example options for Race and Attribute
const cardTypes = [
  "All", "Monster", "Spell", "Trap", 
  "Effect Monster", "Normal Monster", 
  "Fusion Monster", "Ritual Monster", 
  "Synchro Monster", "XYZ Monster", 
  "Link Monster", "Skill Card"
];

const races = [
  "All", "Warrior", "Spellcaster", "Fairy", 
  "Beast", "Beast-Warrior", "Dinosaur", 
  "Dragon", "Machine", "Aqua", "Fiend", 
  "Zombie", "Plant", "Insect", "Winged Beast","Rock"
];

const attributes = [
  "All", "FIRE", "WATER", "WIND", 
  "EARTH", "LIGHT", "DARK"
];

const FetchCard = () => {
  const [cardName, setCardName] = useState("");
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRace, setSelectedRace] = useState("All");
  const [selectedAttribute, setSelectedAttribute] = useState("All");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleFetchData = async () => {
    try {
      setError(null); // Reset any previous errors
      setIsSearchClicked(true); // Indicate that the search button has been clicked
      const cardsData = await fetchCardData(cardName);
      setCards(cardsData); // Set the fetched card data
      setShowResults(true); // Ensure results are shown after a search
    } catch (error) {
      setError("Card not found. Please try another card name.");
      setCards([]); // Reset the card data
      setFilteredCards([]);
    }
  };

  useEffect(() => {
    // Filter cards based on selected type, race, and attribute
    let results = cards;

    if (selectedType !== "All") {
      results = results.filter(card => card.type.includes(selectedType));
    }
    
    if (selectedRace !== "All") {
      results = results.filter(card => card.race === selectedRace);
    }
    
    if (selectedAttribute !== "All") {
      results = results.filter(card => card.attribute === selectedAttribute);
    }
    
    setFilteredCards(results);
  }, [cards, selectedType, selectedRace, selectedAttribute]);

  const shouldShowResults = isSearchClicked && (filteredCards.length > 0 || error);

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  return (
    
    <div className="context-style5">
      <h2>Card Search</h2>
      <div className="context-style7">
        Card Name:&nbsp;&nbsp;
        <input
        type="text"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Enter card name"
        className="search-input"
      /></div>
      <button onClick={handleFetchData} className="fetch-button">Search Card</button>

      <div className="filter-container">
        <label htmlFor="typeFilter">Type: </label>
        <select
          id="typeFilter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="filter-select"
        >
          {cardTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-container">
        <label htmlFor="raceFilter">Race: </label>
        <select
          id="raceFilter"
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          className="filter-select"
        >
          {races.map((race) => (
            <option key={race} value={race}>{race}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-container">
        <label htmlFor="attributeFilter">Attribute: </label>
        <select
          id="attributeFilter"
          value={selectedAttribute}
          onChange={(e) => setSelectedAttribute(e.target.value)}
          className="filter-select"
        >
          {attributes.map((attribute) => (
            <option key={attribute} value={attribute}>{attribute}</option>
          ))}
        </select>
      </div>

      {shouldShowResults && (
        <button onClick={toggleResults} className="toggle-button">
          {showResults ? "Hide result(s)" : "Show result(s)"}
        </button>
      )}
      <br />
      {shouldShowResults && showResults && (
        <div>
          {filteredCards.map((card) => (
            <Paper elevation={3} className="fetch-card-paper" key={card.id}>
              <div className="card-container2">
                
                
                <h3>{card.name}</h3>
                <Box className="context-style3">
                <img src={card.card_images[0].image_url} alt={card.name} className="card-image" />
                
                {card.type.includes("Trap") || card.type.includes("Spell") || card.type.includes("Skill Card") ? (
                  <Typography sx={{fontFamily:'Robotic'}}><strong>property:</strong> {card.race}</Typography>
                ) : (
                  <Box className="context-style1-6">
                    <Typography sx={{fontFamily:'Robotic'}}><strong >Type:</strong> {card.type}</Typography>
                    <Typography sx={{fontFamily:'Robotic'}}><strong>Attack:</strong> {card.atk}</Typography>
                    <Typography sx={{fontFamily:'Robotic'}}><strong>Defense:</strong> {card.def}</Typography>
                    {card.type.includes("Link") ? (
                      <Typography sx={{fontFamily:'Robotic'}}><strong>Link value:</strong> {card.linkval}</Typography>
                    ) : card.type.includes("XYZ") ? (
                      <Typography sx={{fontFamily:'Robotic'}}><strong>Rank:</strong> {card.level}</Typography>
                    ) : (
                      <Typography sx={{fontFamily:'Robotic'}}><strong>Level:</strong> {card.level}</Typography>
                    )}
                    <Typography sx={{fontFamily:'Robotic'}}><strong>Race:</strong> {card.race}</Typography>
                    <Typography sx={{fontFamily:'Robotic'}}><strong>Attribute:</strong> {card.attribute}</Typography>
                  </Box>
                )}
                </Box>
                <Box className="context-style">
                <Typography sx={{fontFamily:'Robotic'}}><strong>Description:</strong> {card.desc}</Typography>
                </Box>
              </div>
            </Paper>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FetchCard;

