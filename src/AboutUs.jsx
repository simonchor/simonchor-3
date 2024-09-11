import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import './AboutUs.css';

function AboutUs() {
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="about-us">
                <Typography variant="h4" component="h1" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="body1" paragraph>
                    大家好，我叫Simon。這裡是一個為遊戲王玩家提供多樣實用功能的網站，亦是本人做過的第二份個人網站項目。
                    在網站建立的當初其實只有“搜尋卡片”這一個功能存在。不過隨著腦海裡不斷湧現的想法，
                    我決定將我的網站建立成一個真正可以便利到遊戲王玩家的網站（如果項目可以上線的話）
                </Typography>
                <Typography variant="body1" paragraph>
                    大家好，我叫Simon，这里是一个为游戏王玩家提供多样实用功能的网站，也是本人制作的第二份个人网站项目。
                    在网站的建立初期其实只有“查卡”这一功能存在。不过随着脑海里不断涌现的各种小点子，
                    我决定将我的网站建立成一个可以真正便利游戏王玩家的网站（前提是项目可以上线）
                </Typography>
                <Typography variant="body1" paragraph>
                    Hi there, Simon's speaking. This is a website that provides various practical functions for Yu-Gi-Oh trading card game players,
                    and also this is my second personal website project. At the beginning, there is only a search card function available on this website,
                    but with more and more inspirations coming to my mind, I decided to develop a website that can really help Yu-Gi-Oh players if the website can be released.
                </Typography>
                <Typography variant="body1" paragraph>
                    如果你有更多問題想了解或想與本人進行一些交流，非常歡迎你用電郵與本人取得聯繫。
                </Typography>
                <Typography variant="body1" paragraph>
                    如果你有更多问题想了解或者想与本人进行一些交流，非常欢迎你使用邮件与本人取得联系。
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any further questions or want to have a conversation with me, please feel free to email me.
                </Typography>
                <Typography variant="body1" paragraph>
                    <br />
                    E-mail:
                    <br />
                    chorchungho@gmail.com
                    <br /><br /><br /><br />
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                    External links:
                </Typography>
                <Link href="https://cardgame-network.konami.net/top" target="_blank" rel="noopener">
                    Konami Card Game Network
                </Link>
            </div>
        </Box>
    );
}

export default AboutUs;
