import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/UnlockSuccess.css";
import lockIcon from "../assets/unlockSucess.png";
import BottomNavigation from "../components/BottomNavigation";

const UnlockSuccess = () => {
  const navigate = useNavigate();
  const { roomName } = useParams();

  return (
    <div className="unlock-success">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>Unlock Success</h1>
      </div>
      <div className="room-number">
        <span>Room Number: {roomName}</span>
      </div>
      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>

        <button className="unlock-button-success unlocked" disabled>
          Room {roomName} has been unlocked Successfully
        </button>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default UnlockSuccess;
