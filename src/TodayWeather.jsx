// TodayWeather.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import './TodayWeather.css';

const TodayWeather = () => {
    const [todayWeather, setTodayWeather] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 使用 useNavigate

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                
    
                // 请求今天的天气
                const todayResponse = await axios.get(
                    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php',
                    {
                        params: {
                            dataType: 'rhrread',  // 实时天气数据接口
                            lang: 'tc',
                        },
                    }
                );
                const todayData = todayResponse.data.temperature;
                console.log(todayResponse.data);

                setTodayWeather({
                    forecastDate: todayResponse.data.updateTime.slice(0, 10),  // 提取日期部分
                    forecastMintemp: { value: Math.min(...todayData.data.map(item => item.value)) },  // 最低温
                    forecastMaxtemp: { value: Math.max(...todayData.data.map(item => item.value)) },  // 最高温
                    forecastWeather: todayResponse.data.icon[0],  // 图标
                    forecastWind: todayResponse.data.wind,        // 风力信息
                    forecastMinrh: { value: Math.min(...todayData.data.map(item => item.value)) },  // 湿度
                    forecastMaxrh: { value: Math.max(...todayData.data.map(item => item.value)) },  // 湿度
                    warningMessage: todayResponse.data.warningMessage.length > 0 ? todayResponse.data.warningMessage[0] : null,
                });
            } catch (error) {
                setError('Error fetching weather data');
            }
        };

        fetchWeatherData();
    }, []);

    const formatDate = (dateString) => {
        return `${dateString.slice(0, 4)}${dateString.slice(4, 6)}${dateString.slice(6)}`;
    };

    const handleCardClick = () => {
        navigate('/weather'); // 跳转到 Weather 组件页面
    };

    return (
        <Card elevation={3} className='today-weather' onClick={handleCardClick}>
            <CardContent>
                {error && <Typography color="error">{error}</Typography>}
                {todayWeather && (
                    <>
                        <Typography variant="h6">{formatDate(todayWeather.forecastDate)}{todayWeather.week}</Typography>
                        <br /><br /><br />
                        <img
                        src={`https://www.hko.gov.hk/images/HKOWxIconOutline/pic${todayWeather.forecastWeather}.png`}
                        alt={todayWeather.forecastWeather}
                        className="weather-icon"
                    />
                        <br /><br />
                        <Typography variant="body2">{todayWeather.forecastWind}</Typography>
                        {todayWeather.warningMessage && (
    <Typography variant="body2" color="#ff0000">
        Warning: {todayWeather.warningMessage}
    </Typography>
)}
                    <Typography variant="body2">Min Temp: {todayWeather.forecastMintemp.value}°C</Typography>
                    <Typography variant="body2">Max Temp: {todayWeather.forecastMaxtemp.value}°C</Typography>
                    <Typography variant="body2">Humidity: {todayWeather.forecastMinrh.value}% - {todayWeather.forecastMaxrh.value}%</Typography>
                        
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default TodayWeather;
