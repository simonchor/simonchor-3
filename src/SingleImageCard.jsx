// SingleImageCard.jsx
import React from 'react';
import { Card } from '@mui/material';
import './SingleImageCard.css'

const SingleImageCard = ({ image, index }) => {
    return (
        <Card key={index} elevation={3} className='sample-image'>
            <img src={image} alt={`Sample ${index + 1}`} style={{ width: '100%', borderRadius: '2%' }} />
        </Card>
    );
};

export default SingleImageCard;
