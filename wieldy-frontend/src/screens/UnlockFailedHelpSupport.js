import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UnlockRoom.css";
import lockIcon from "../assets/unlockingFailed.png";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

const UnlockFailedHelpSupport = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const handleBackToUnlocking = () => {
    navigate(`/unlocking-details/${reservationId}`, {
      state: { canUnlockRooms: true },
    });
  };
  return (
    <>
      <div className="header">
        <button className="back-button" onClick={handleBackToUnlocking}>
          ←
        </button>
        <h1>Unlock Failed</h1>
      </div>

      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>

        <button className="unlock-button unlocked" disabled>
          Unlocking Failed, Connect To Support Team.
        </button>

        <div className="bottom-navigation">
          <button onClick={() => navigate("/dashboard")}>
            <img src={home} alt="Home" />
          </button>
          <button onClick={() => navigate(`/bookingdetails/${reservationId}`)}>
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
    </>
  );
};

export default UnlockFailedHelpSupport;
