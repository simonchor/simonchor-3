import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Drawer } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DehazeIcon from '@mui/icons-material/Dehaze';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import PlaceIcon from '@mui/icons-material/Place';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import WhatshotIcon from '@mui/icons-material/Whatshot';

function SideBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(!isMobile);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const location = useLocation(); // Get the current route location

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const fetchUser = () => {
            const user = localStorage.getItem('loggedInUser'); // Retrieve the user data from localStorage
            if (user) {
                setLoggedInUser(JSON.parse(user)); // Parse and set the user data
            } else {
                setLoggedInUser(null);
            }
        };

        fetchUser();
    }, []); // Dependency array is empty to only run once on component mount

    const handleToggle = () => {
        setOpen(prev => !prev);
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout');
            localStorage.removeItem('loggedInUser'); // Remove user data from localStorage
            setLoggedInUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Function to check if the current page matches the list item's path
    const isCurrentPage = (path) => location.pathname === path;

    return (
        <Box sx={{ display: 'flex', position: 'relative' }}>
            <IconButton
                onClick={handleToggle}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1200,
                }}
            >
                <DehazeIcon />
            </IconButton>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? open : true}
                onClose={isMobile ? () => setOpen(false) : undefined}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
                }}
            >
                <List>
                    {loggedInUser ? (
                        <>
                            <ListItem>
                                <ListItemText primary={`Welcome, ${loggedInUser.name || loggedInUser.email}`} />
                            </ListItem>
                            <ListItem 
                                button 
                                component={Link} 
                                to="/profile" 
                                sx={isCurrentPage("/profile") ? { backgroundColor: 'lightgray' } : {}}
                            >
                                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                            <ListItem button onClick={handleLogout}>
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem 
                                button 
                                component={Link} 
                                to="/login" 
                                sx={isCurrentPage("/login") ? { backgroundColor: 'lightgray' } : {}}
                            >
                                <ListItemIcon><LoginIcon /></ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItem>
                            <ListItem 
                                button 
                                component={Link} 
                                to="/register" 
                                sx={isCurrentPage("/register") ? { backgroundColor: 'lightgray' } : {}}
                            >
                                <ListItemIcon><AppRegistrationIcon /></ListItemIcon>
                                <ListItemText primary="Register" />
                            </ListItem>
                        </>
                    )}
                    <br />_____________________________________<br /><br />
                    <ListItem 
                        button 
                        component={Link} 
                        to="/" 
                        sx={isCurrentPage("/") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem 
                        button 
                        component={Link} 
                        to="/strong_card_intro" 
                        sx={isCurrentPage("/strong_card_intro") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><FitnessCenterIcon /></ListItemIcon>
                        <ListItemText primary="Strong Card Intro" />
                    </ListItem>
                    <ListItem 
                        button 
                        component={Link} 
                        to="/strong_theme_intro" 
                        sx={isCurrentPage("/strong_theme_intro") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><WhatshotIcon /></ListItemIcon>
                        <ListItemText primary="Strong Theme Intro" />
                    </ListItem>
                    <ListItem 
                        button 
                        component={Link} 
                        to="/build_deck" 
                        sx={isCurrentPage("/build_deck") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><BuildIcon /></ListItemIcon>
                        <ListItemText primary="Build Deck" />
                    </ListItem>
                    <ListItem 
                        button 
                        component={Link} 
                        to="/weather" 
                        sx={isCurrentPage("/weather") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><WbSunnyIcon /></ListItemIcon>
                        <ListItemText primary="Weather" />
                    </ListItem>
                    <ListItem 
                        button 
                        component={Link} 
                        to="/card_shop_location" 
                        sx={isCurrentPage("/card_shop_location") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><PlaceIcon /></ListItemIcon>
                        <ListItemText primary="Card Shop Location" />
                    </ListItem>
                    <ListItem 
                        button 
                        component={Link} 
                        to="/about_us" 
                        sx={isCurrentPage("/about_us") ? { backgroundColor: 'lightgray' } : {}}
                    >
                        <ListItemIcon><InfoIcon /></ListItemIcon>
                        <ListItemText primary="About Us" />
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default SideBar;
