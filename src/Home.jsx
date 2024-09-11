import React, { useEffect, useState } from "react";
import { Box, Card,Grid } from "@mui/material";
import Footer from "./Footer.jsx";
import FetchCard from "./FetchCard";
import Carousel from './Carousel';
import Carousel_2 from "./Carousel_2.jsx";
import TodayWeather from "./TodayWeather";
import HomeMap from "./HomeMap.jsx";
import SingleImageCard from './SingleImageCard.jsx';
import axios from "axios";

function Home() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sampleName');
                console.log(response.data);
                setImages(response.data.map(item => item.sampleName));
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <>
            <Box component="main" className="context-style4">
            <Grid container spacing={2} justifyContent="center" sx={{marginTop:'20px'}}>
            <Box className="context-style" sx={{marginTop:'15px'}}><Card elevation={4} ><SingleImageCard image={images[0]} index={0} /><FetchCard /></Card></Box>          
            <Box className="context-style">
                <Box className="context-style3">
                            <Box className="context-style3-1">
                            <Card elevation={3} sx={{ padding: '10px', borderRadius: '2%', width: '330px',height:'400px'  }}>
                                <Carousel />
                            </Card>
                            
                            </Box>
                            <Box className="context-style3-2">
                            <Card elevation={3} sx={{ padding: '10px', borderRadius: '2%', width: '330px',height:'400px' }}>
                                <Carousel_2 />
                            </Card>
                            </Box>
                </Box>
                    <Box className="context-style3" >
                    <Box className="context-style2" >
                    <TodayWeather/>
                    </Box>
                    <HomeMap/>
                    </Box>
            </Box>               
            </Grid>
            
        </Box>
        <Box className="context-style"><Footer /></Box>
        </>
    );
}

export default Home;
