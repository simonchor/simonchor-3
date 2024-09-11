import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, createTheme } from "@mui/material";
import Home from "./Home";
import BuildDeck from "./BuildDeck";
import StrongCard_Intro from "./StrongCard_Intro";
import CardShopLocation from "./Card_shop_location";
import SideBar from "./SideBar";
import Header from "./header.jsx";
import './Card_shop_location.css';
import AboutUs from "./AboutUs.jsx";
import Weather from "./Weather.jsx";
import Login from "./Login"; // Import Login component
import Register from "./Register"; // Import Register component
import Profile from "./Profile.jsx";
import StrongTheme_Intro from "./StrongTheme_intro.jsx";

const theme = createTheme({
  palette: {
    primary: {
        main: '#1976d2',
    },
    secondary: {
        main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            setLoggedInUser(user);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        <SideBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                        <Box sx={{ flexGrow: 1, p: 3 }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/build_deck" element={<BuildDeck loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>} />
                                <Route path="/strong_card_intro" element={<StrongCard_Intro />} />
                                <Route path="/card_shop_location" element={<CardShopLocation />} />
                                <Route path="/about_us" element={<AboutUs />} />
                                <Route path="/weather" element={<Weather />} />
                                <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/strong_theme_intro" element={<StrongTheme_Intro />} />
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

