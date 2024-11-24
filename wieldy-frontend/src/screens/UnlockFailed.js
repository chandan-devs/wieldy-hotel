import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPasscode } from "../services/api";
import "../styles/UnlockRoom.css";
import lockIcon from "../assets/unlockingFailed.png";
import BottomNavigation from "../components/BottomNavigation";
import { ArrowLeft } from "lucide-react";

const UnlockFailed = () => {
  const [buttonText, setButtonText] = useState("Fetching passcode...");
  const navigate = useNavigate();
  const { reservationId, roomName } = useParams();

  useEffect(() => {
    const fetchPasscode = async () => {
      try {
        const passcodeResponse = await getPasscode(reservationId, roomName);
        if (passcodeResponse && passcodeResponse.passcode) {
          setButtonText(
            `Unlocking Failed. Try Passcode: ${passcodeResponse.passcode}#`
          );
        } else {
          setButtonText("Failed to retrieve passcode. Please contact support.");
        }
      } catch (passcodeError) {
        console.error("Error fetching passcode:", passcodeError);
        setButtonText("Failed to retrieve passcode. Please contact support.");
      }
    };
    fetchPasscode();
  }, [reservationId, roomName]);

  return (
    <div className="unlock-room">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
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
        <button className="unlock-button unlocked" disabled>
          {buttonText}
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default UnlockFailed;
