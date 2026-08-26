import React from "react";
import "./Logo.scss";
import logo from "../../images/logo.png";

const Logo = ({ size = "3x" }) => {
  return (
    <div className="app-logo no-select">
      <span>
        <img
          src={logo}
          alt="ClauseIQ logo"
          style={{ width: "60px", height: "60px" }}
        />
      </span>
      <h1>
        Clause<span>IQ</span>
      </h1>
    </div>
  );
};

export default Logo;
