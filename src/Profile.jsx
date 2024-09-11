import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar } from '@mui/material';
import axios from 'axios';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('/LOL_Gwen_default_pro_pic'); // Set a default picture URL
    const [description, setDescription] = useState('My name is, Atum!');
    const [error, setError] = useState('');

    useEffect(() => {
        // Load user data from localStorage
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setProfilePicture(user.profilePicture || '/LOL_Gwen_default_pro_pic');
            setDescription(user.description || 'My name is, Atum!');
        }
    }, []);

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put('http://localhost:5000/profile', {
                email,
                name,
                profilePicture,
                description
            });
            if (response.status === 200) {
                localStorage.setItem('loggedInUser', JSON.stringify(response.data));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred, please try other words/image and reload the page.');
        }
    };

    return (
        <Box sx={{ p: 3, marginLeft: "16%", marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>Profile</Typography>
            <Avatar 
                src={profilePicture} 
                sx={{ width: 100, height: 100, mb: 2 }} 
            />
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleProfilePictureChange} 
                style={{ marginBottom: '16px' }}
            />
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default Profile;


