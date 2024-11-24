import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/UnlockRoom.css";
import lockIcon from "../assets/unlockingFailed.png";
import BottomNavigation from "../components/BottomNavigation";

const UnlockFailedHelpSupport = () => {
  const navigate = useNavigate();
  const { reservationId, roomName } = useParams();

  const handleBackToUnlocking = () => {
    navigate(`/unlocking-details/${reservationId}`);
  };

  const handleNavigateToSupport = () => {
    navigate("/help-support");
  };

  return (
    <div className="unlock-room">
      <div className="header">
        <button className="back-button" onClick={handleBackToUnlocking}>
          <ArrowLeft />
        </button>
        <h1>Unlock Failed</h1>
      </div>
      <div className="room-number">
        <span>Room Number: {roomName}</span>
      </div>
      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>

        <button
          className="unlock-button unlocked"
          onClick={handleNavigateToSupport}
        >
          Unlocking Failed, Connect To Support Team
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default UnlockFailedHelpSupport;
