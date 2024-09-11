import React, { useState, useEffect } from 'react';
import { Box, IconButton, Drawer, Paper, Typography, Card, CardContent, Button, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme, useMediaQuery } from '@mui/material';
import './BuildDeck_style.css';
import SaveIcon from '@mui/icons-material/Save';
import './Home_style.css'
import axios from 'axios';


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

const BuildCard = ({ addToDeck }) => {
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
    <div className="context-style">
      <h1>Please enter the card name: </h1>
      <input
        type="text"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Enter card name"
        className="search-input"
      />
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
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 6, 
                width: 'calc(100% - 50px)', // Ensures the width fits within the sidebar
                padding: '20px', 
                margin: '20px', 
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }} 
              key={card.id}
            >
              <div className="card-container2" >
              <h3>{card.name}</h3>
                <Box className="context-style3">
                <img src={card.card_images[0].image_url} alt={card.name} className="card-image" />
                
                
                {card.type.includes("Trap") || card.type.includes("Spell") || card.type.includes("Skill Card") ? (
                  <p><strong>Property:</strong> {card.race}</p>
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
                <div>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => addToDeck(card, 'main')}
                    sx={{ margin: '5px', backgroundColor: 'blue' }}
                  >
                    Add to Main Deck
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => addToDeck(card, 'side')}
                    sx={{ margin: '5px', backgroundColor: 'red' }}
                  >
                    Add to Side Deck
                  </Button>
                </div>
                <br /><br />
              </div>
            </Paper>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

function BuildDeck() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [mainDeck, setMainDeck] = useState([]);
  const [extraDeck, setExtraDeck] = useState([]);
  const [sideDeck, setSideDeck] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [deckName, setDeckName] = useState('');

  useEffect(() => {
    setOpen(!isMobile);
}, [isMobile]);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
      
      setDeckName(user.deckName || 'Default Deck');
      setMainDeck(user.mainDeck || []);
      setExtraDeck(user.extraDeck || []);
      setSideDeck(user.sideDeck || []);
  } 
}, []); 


  useEffect(() => {
      const fetchAllCardData = async () => {
          try {
              const data = await fetchCardData();
              setAllCards(data);
          } catch (error) {
              console.error("Error fetching all card data: ", error);
          }
      };
      fetchAllCardData();
  }, []);

  

  const maxCardCount = 3; // Maximum count per card type
  const maxMainDeck = 60; // Maximum cards in Main Deck
  const maxExtraDeck = 15; // Maximum cards in Extra Deck
  const maxExtraSideDeck = 15; // Maximum cards in Extra Deck or Side Deck

  const addToDeck = (card, deck) => {
    // 计算卡片在所有卡组中的总数量
    const totalCardCount = 
        mainDeck.filter(item => item === card.id).length +
        extraDeck.filter(item => item === card.id).length +
        sideDeck.filter(item => item === card.id).length;

    // 如果该卡片的总数量已经达到最大限制，则不再添加
    if (totalCardCount >= maxCardCount) {
        return;
    }

    if (deck === 'main') {
        // 检查主卡组是否已满
        if (mainDeck.length >= maxMainDeck) {
            return;
        }

        // 如果是额外卡组中的卡片类型，则添加到额外卡组
        if (card.type.includes("Fusion Monster") || 
            card.type.includes("Synchro Monster") || 
            card.type.includes("XYZ Monster") || 
            card.type.includes("Link Monster")) {
            
            // 检查额外卡组是否已满
            if (extraDeck.length >= maxExtraDeck) {
                return;
            }

            setExtraDeck(prev => [...prev, card.id]);
        } else {
            // 将卡片添加到主卡组
            setMainDeck(prev => [...prev, card.id]);
        }
    } else if (deck === 'side') {
        // 检查副卡组是否已满
        if (sideDeck.length >= maxExtraSideDeck) {
            return;
        }
        // 将卡片添加到副卡组
        setSideDeck(prev => [...prev, card.id]);
    }
};


  const removeFromDeck = (card, deck) => {
      if (deck === 'main') {
          setMainDeck(prev => {
              const updatedDeck = [...prev];
              const index = updatedDeck.findIndex(item => item === card.id);
              if (index > -1) {
                  updatedDeck.splice(index, 1);
              }
              return updatedDeck;
          });
      } else if (deck === 'extra') {
          setExtraDeck(prev => {
              const updatedDeck = [...prev];
              const index = updatedDeck.findIndex(item => item === card.id);
              if (index > -1) {
                  updatedDeck.splice(index, 1);
              }
              return updatedDeck;
          });
      } else if (deck === 'side') {
          setSideDeck(prev => {
              const updatedDeck = [...prev];
              const index = updatedDeck.findIndex(item => item === card.id);
              if (index > -1) {
                  updatedDeck.splice(index, 1);
              }
              return updatedDeck;
          });
      }
  };

  const getCardById = (id) => {
      return allCards.find(card => card.id === id);
  };

  const saveDeck = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
          const response = await axios.put('http://localhost:5000/build_deck', {
                email: user.email,
                deckName,
                mainDeck,
                extraDeck,
                sideDeck
            });
            console.log('Deck saved successfully');
            if (response.status === 200) {
              const updatedUser = { ...user, ...response.data };
              localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
              console.log('Deck saved successfully');
          }
        }
    } catch (error) {
        console.error('Error saving deck:', error);
    }
};



  return (
      <Box sx={{ display: 'flex', position: 'relative' }}>
          <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                  position: 'absolute',
                  top: -20,
                  right: -35,
                  zIndex: 1200,
              }}
          >
              <SearchIcon />
          </IconButton>
          <Drawer
              anchor="right"
              variant={isMobile ? "temporary" : "permanent"}
              open={isMobile ? open : true}
              onClose={isMobile ? () => setOpen(false) : undefined}
              sx={{
                  '& .MuiDrawer-paper': { 
                      boxSizing: 'border-box', 
                      width: 350,
                      padding: 3,
                      overflowX:'hidden'
                  },
              }}
          >
              <BuildCard addToDeck={addToDeck} />
          </Drawer>
          <Box component="main" className="main-container2">
            <br />
            <Box>
              <TextField label="Deck Name" value={deckName}
                        onChange={(e) => setDeckName(e.target.value)} sx={{ width: '100%', maxWidth: '400px' }}/>
              <IconButton aria-label="save deck" size="large" onClick={saveDeck}>
              <SaveIcon fontSize="inherit" />
              </IconButton>
            </Box>
              <Typography variant="h6">Main Deck</Typography>
              <Card sx={{ border: '1px solid #ccc', borderRadius: 0,  width: '100%', maxWidth: '1000px', maxHeight: '1300px' }}>
                  <CardContent>
                      {mainDeck.map(id => {
                          const card = getCardById(id);
                          return card ? (
                              <img
                                  key={id}
                                  src={card.card_images[0].image_url}
                                  alt={card.name}
                                  className="card-image"
                                  onDoubleClick={() => removeFromDeck(card, 'main')}
                                  style={{ width: '100px', height: 'auto', cursor: 'pointer', margin: '5px' }}
                              />
                          ) : null;
                      })}
                  </CardContent>
              </Card>
              <Typography variant="h6">Extra Deck</Typography>
              <Card sx={{ border: '1px solid #ccc', borderRadius: 0,  width: '100%', maxWidth: '1000px' }}>
                  <CardContent>
                      {extraDeck.map(id => {
                          const card = getCardById(id);
                          return card ? (
                              <img
                                  key={id}
                                  src={card.card_images[0].image_url}
                                  alt={card.name}
                                  className="card-image"
                                  onDoubleClick={() => removeFromDeck(card, 'extra')}
                                  style={{ width: '100px', height: 'auto', cursor: 'pointer', margin: '5px' }}
                              />
                          ) : null;
                      })}
                  </CardContent>
              </Card>
              <Typography variant="h6">Side Deck</Typography>
              <Card sx={{ border: '1px solid #ccc', borderRadius: 0,  width: '100%', maxWidth: '1000px' }}>
                  <CardContent>
                      {sideDeck.map(id => {
                          const card = getCardById(id);
                          return card ? (
                              <img
                                  key={id}
                                  src={card.card_images[0].image_url}
                                  alt={card.name}
                                  className="card-image"
                                  onDoubleClick={() => removeFromDeck(card, 'side')}
                                  style={{ width: '100px', height: 'auto', cursor: 'pointer', margin: '5px' }}
                              />
                          ) : null;
                      })}
                  </CardContent>
              </Card>
              <br /><br />
          </Box>
      </Box>
  );
}

export default BuildDeck;