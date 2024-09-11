import React from "react";
import { Link } from 'react-router-dom'; // Import Link for navigation
import "./Header_style.css"; // Import the CSS file

function Header() {
    return (
        <header className="header">
            <h1>
                <Link to="/" className="header-link">
                    YGO Card Search
                </Link>
            </h1>
        </header>
    );
}

export default Header;
