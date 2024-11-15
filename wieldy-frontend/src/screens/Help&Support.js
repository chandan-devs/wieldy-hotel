import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Help&Support.css";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

const UnlockRoom = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const handleUnlock = () => {
    setIsUnlocked(true);
    // Add your unlocking logic here
  };

  return (
    <>
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Help & Support</h1>
      </div>
      <div>
        <div className="room-number">
          <span>Mail to: support@wieldyportal.co.uk</span>
        </div>
        <div className="room-number">
          <span>Contact us on WhatsAp</span>
        </div>
        <div className="room-number">
          <span>Visit our Website</span>
        </div>
      </div>

      <div className="bottom-navigation">
        <button onClick={() => navigate("/dashboard")}>
          <img src={home} alt="Home" />
        </button>
        <button onClick={() => navigate(`/bookingdetails/${roomId}`)}>
          <img src={checkIn} alt="Check In" />
        </button>
        <button>
          <img src={key} alt="Key" />
        </button>
        <button>
          <img src={help} alt="Help" />
        </button>
      </div>
    </>
  );
};

export default UnlockRoom;
