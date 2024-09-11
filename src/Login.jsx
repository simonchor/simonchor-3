import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password
            });
            if (response.status === 200) {
                localStorage.setItem('loggedInUser', JSON.stringify(response.data));
                navigate('/');
                window.location.reload(); // Refresh to update sidebar state
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <Box sx={{ p: 3, marginLeft: "16%", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
        </Box>
    );
};

export default Login;
