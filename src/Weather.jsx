// Weather.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography } from '@mui/material';
import './Weather.css';

const Weather = () => {
    const [forecast, setForecast] = useState([]);
    const [todayWeather, setTodayWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // 请求未来9天天气
                const forecastResponse = await axios.get(
                    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php',
                    {
                        params: {
                            dataType: 'fnd',
                            lang: 'tc',
                        },
                    }
                );
                const forecastData = forecastResponse.data.weatherForecast;
                setForecast(forecastData); // 设置9天的预报数据
    
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
        return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6)}`;
    };
    const formatDate2 = (dateString) => {
        return `${dateString.slice(0, 4)}${dateString.slice(4, 6)}${dateString.slice(6)}`;
    };

    return (
    <Box className="weather-container">
        <Box sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom className="section-title">Today's Weather</Typography>
    <Box className="weather-container2">
        {error && <Typography color="error">{error}</Typography>}
        {todayWeather ? (
            <Card className="weather-card">
                <CardContent>
                    <Typography variant="h6">{formatDate2(todayWeather.forecastDate)}</Typography>
                    <Typography variant="body2">Today</Typography>
                    <img
                        src={`https://www.hko.gov.hk/images/HKOWxIconOutline/pic${todayWeather.forecastWeather}.png`}
                        alt={todayWeather.forecastWeather}
                        className="weather-icon"
                    />
                    <Typography variant="body2">{todayWeather.forecastWind}</Typography>
                    {todayWeather.warningMessage && (
    <Typography variant="body2" color="#ff0000">
        Warning: {todayWeather.warningMessage}
    </Typography>
)}
                    <Typography variant="body2">Min Temp: {todayWeather.forecastMintemp.value}°C</Typography>
                    <Typography variant="body2">Max Temp: {todayWeather.forecastMaxtemp.value}°C</Typography>
                    <Typography variant="body2">Humidity: {todayWeather.forecastMinrh.value}% - {todayWeather.forecastMaxrh.value}%</Typography>
                </CardContent>
            </Card>
        ) : (
            <Typography variant="body2"></Typography>
        )}
    </Box>
    <Typography variant="h4" gutterBottom className="section-title">9-Day Weather Forecast</Typography>
    <Box className="weather-container">
        {forecast.map((day, index) => (
            <Card key={index} className="weather-card">
                <CardContent>
                    <Typography variant="h6">{formatDate(day.forecastDate)}</Typography>
                    <Typography variant="body2">{day.week}</Typography>
                    <img
                        src={`https://www.hko.gov.hk/images/HKOWxIconOutline/pic${day.ForecastIcon}.png`}
                        alt={day.ForecastIcon}
                        className="weather-icon"
                    />
                    <Typography variant="body2">{day.forecastWind}</Typography>
                    <Typography variant="body2">{day.forecastWeather}</Typography>
                    <Typography variant="body2">Min Temp: {day.forecastMintemp.value}°C</Typography>
                    <Typography variant="body2">Max Temp: {day.forecastMaxtemp.value}°C</Typography>
                    <Typography variant="body2">Humidity: {day.forecastMinrh.value}% - {day.forecastMaxrh.value}%</Typography>
                </CardContent>
            </Card>
        ))}
    </Box>
</Box>
    </Box>

    );
};

export default Weather;