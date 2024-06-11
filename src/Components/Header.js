import React from "react";
import "./Header.css";

const Header = ({ calculatedPrice }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="company-name">AI Motors</span>
      </div>
      <div className="navbar-right">
        {calculatedPrice !== null && (
          <span className="calculated-price">Price: ${calculatedPrice}</span>
        )}
      </div>
    </nav>
  );
};

export default Header;
