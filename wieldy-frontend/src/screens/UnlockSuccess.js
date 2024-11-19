import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/UnlockSuccess.css";
import lockIcon from "../assets/unlockSucess.png";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

const UnlockSuccess = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  return (
    <div className="unlock-success">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>Unlock Success</h1>
      </div>
      <div className="room-number">
        <span>Room Number: {roomId}</span>
      </div>
      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>

        <button className="unlock-button-success unlocked" disabled>
          Room {roomId} has been unlocked Successfully
        </button>

        <div className="unlockSuccess-bottom-navigation">
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
      </div>
    </div>
  );
};

export default UnlockSuccess;
