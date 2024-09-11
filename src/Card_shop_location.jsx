import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';
import './Card_shop_location.css';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom'; // 导入 useLocation

const CardShopLocation = () => {
    const [hkiShops, setHKIShops] = useState([]);
    const [kwlShops, setKWLShops] = useState([]);
    const [ntShops, setNTShops] = useState([]);
    const location = useLocation(); // 获取传递过来的店铺信息
    const { shop } = location.state || {}; // 解构传递过来的店铺信息

    const shopRef = useRef(null); // 创建一个引用来定位店铺

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hkiResponse = await fetch('http://localhost:5000/api/HKIshops');
                const hkiData = await hkiResponse.json();
                setHKIShops(hkiData);

                const kwlResponse = await fetch('http://localhost:5000/api/KWLshops');
                const kwlData = await kwlResponse.json();
                setKWLShops(kwlData);

                const ntResponse = await fetch('http://localhost:5000/api/NTshops');
                const ntData = await ntResponse.json();
                setNTShops(ntData);
            } catch (error) {
                console.error('Failed to fetch shop data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // 当店铺信息传递过来时，自动滚动到对应的店铺位置
        if (shop && shopRef.current) {
            shopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [shop]);

    const renderShopCards = (shops) => {
        return shops.map((currentShop) => (
            <Grid
                item
                xs={12} sm={6} md={4}
                key={currentShop.shopName}
                ref={currentShop.shopName === shop?.shopName ? shopRef : null} // 如果是匹配的店铺，添加 ref
            >
                <Card className="shop-card" style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {currentShop.shopName}
                        </Typography>
                        <Typography color="textSecondary">
                            Location: {currentShop.location}
                        </Typography>
                        <Typography color="textSecondary">
                            Hours: {currentShop.workingHours}
                        </Typography>
                        <iframe
                            src={currentShop.mapUrl}
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title={currentShop.shopName}
                        ></iframe>
                    </CardContent>
                </Card>
            </Grid>
        ));
    };

    return (
        <Box className="main-container">
            <Container className="region-container">
                <Typography variant="h3" component="h2" className="region-title" gutterBottom>
                    Hong Kong Island OTS Card Shops
                </Typography>
                <Grid container spacing={3} className="region-container">
                    {renderShopCards(hkiShops)}
                </Grid>

                <Typography variant="h3" component="h2" className="region-title" gutterBottom>
                    Kowloon OTS Card Shops
                </Typography>
                <Grid container spacing={3} className="region-container">
                    {renderShopCards(kwlShops)}
                </Grid>

                <Typography variant="h3" component="h2" className="region-title" gutterBottom>
                    New Territories OTS Card Shops
                </Typography>
                <Grid container spacing={3} className="region-container">
                    {renderShopCards(ntShops)}
                </Grid>
            </Container>
        </Box>
    );
};

export default CardShopLocation;
