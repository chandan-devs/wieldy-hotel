import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getHotelReservationById,
  unlockDoor,
  // getPasscode,
} from "../services/api";
import "../styles/UnlockRoom.css";
import BottomNavigation from "../components/BottomNavigation";
import lockIcon from "../assets/unlock.png";
import UnlockingPreloader from "../components/UnlockingPreloader";

const UnlockRoom = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [buttonText, setButtonText] = useState("Click here to Unlock Now");
  const [isUnlockingPreloader, setIsUnlockingPreloader] = useState(false);
  const [isDoorKeypad, setIsDoorKeypad] = useState(true);
  const navigate = useNavigate();
  const { reservationId, roomName } = useParams();

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await getHotelReservationById(reservationId);
        if (response.success) {
          setReservationData(response.data[0]);
          setIsDoorKeypad(response.data[0].hotelDetails.isDoorKeypad);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };
    fetchReservationData();
  }, [reservationId]);

  const handleUnlock = async () => {
    if (!isUnlocked && reservationData) {
      setIsUnlockingPreloader(true);
      try {
        const token = reservationData.guestDetails.ttLockAccessToken;
        const response = await unlockDoor(token, roomName);

        if (response.success) {
          setButtonText("Room has been unlocked Successfully");
          setIsUnlocked(true);
          navigate(`/unlock-success/${roomName}`);
        } else {
          if (!isDoorKeypad) {
            navigate(
              `/unlock-failed-help-support/${reservationId}/${roomName}`
            );
          } else {
            navigate(`/unlock-failed/${reservationId}/${roomName}`);
          }
        }
      } catch (error) {
        console.error("Error unlocking door:", error);
        setButtonText("Failed to unlock. Redirecting...");
        if (!isDoorKeypad) {
          navigate(`/unlock-failed-help-support/${reservationId}/${roomName}`);
        } else {
          navigate(`/unlock-failed/${reservationId}/${roomName}`);
        }
      } finally {
        setIsUnlockingPreloader(false);
      }
    }
  };

  if (isUnlockingPreloader) {
    return <UnlockingPreloader />;
  }

  return (
    <div className="unlock-room">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>Unlock Your Room</h1>
      </div>
      <div className="room-number">
        <span>Room Number: {roomName}</span>
      </div>
      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>

        <button
          className={`unlock-button ${isUnlocked ? "unlocked" : ""}`}
          onClick={handleUnlock}
          disabled={isUnlocked}
        >
          {buttonText}
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default UnlockRoom;
