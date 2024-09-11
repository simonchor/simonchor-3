import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import './HomeMap.css';

const fetchShopData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch shop data');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching shop data:', error);
        return [];
    }
};

const CardShopLocation2 = () => {
    const [shops, setShops] = useState([]);
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate(); // 使用 useNavigate

    useEffect(() => {
        const fetchData = async () => {
            const hkiShops = await fetchShopData('http://localhost:5000/api/HKIshops');
            const kwlShops = await fetchShopData('http://localhost:5000/api/KWLshops');
            const ntShops = await fetchShopData('http://localhost:5000/api/NTshops');
            setShops([...hkiShops, ...kwlShops, ...ntShops]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(current => (current === shops.length - 1 ? 0 : current + 1));
        }, 10000); // 每10秒切换一次幻灯片

        return () => clearInterval(interval); // 清除定时器，防止内存泄漏
    }, [shops.length]);

    const nextSlide = () => {
        setCurrent(current === shops.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? shops.length - 1 : current - 1);
    };

    // 处理卡片点击事件，进行导航并传递相关的店铺信息
    const handleCardClick = (shop) => {
        navigate('/card_shop_location', { state: { shop } });
    };

    return (
        <Box className="carousel-container2">
            <div className="carousel-slider2">
                <button className="carousel-button2 left" onClick={prevSlide}>❮</button>
                {shops.map((shop, index) => (
                    <div className={`carousel-slide ${index === current ? 'active' : ''}`} key={shop.shopName}>
                        {index === current && (
                            <Card
                                className="shop-card2"
                                style={{ cursor: 'pointer', position: 'relative' }} // 添加 relative 定位
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {shop.shopName}
                                    </Typography>
                                    {/* iframe 显示谷歌地图 */}
                                    <iframe
                                        src={shop.mapUrl}
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title={shop.shopName}
                                    ></iframe>
                                    {/* 在 iframe 上方添加一个透明的 div */}
                                    <div
                                        onClick={() => handleCardClick(shop)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '300px', // 与 iframe 高度匹配
                                            zIndex: 1,
                                            cursor: 'pointer',
                                            backgroundColor: 'transparent',
                                        }}
                                    ></div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ))}
                <button className="carousel-button2 right" onClick={nextSlide}>❯</button>
            </div>
        </Box>
    );
};

export default CardShopLocation2;
