import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPasscode } from "../services/api";
import "../styles/UnlockRoom.css";
import lockIcon from "../assets/unlockingFailed.png";
import BottomNavigation from "../components/BottomNavigation";
import { ArrowLeft } from "lucide-react";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

const UnlockFailed = () => {
  // const [isUnlocked, setIsUnlocked] = useState(false);
  const [buttonText, setButtonText] = useState("Fetching passcode...");
  const navigate = useNavigate();
  const { reservationId, roomId } = useParams();

  // const handleUnlock = () => {
  //   setIsUnlocked(true);
  //   // Add your unlocking logic here
  // };

  useEffect(() => {
    const fetchPasscode = async () => {
      try {
        const passcodeResponse = await getPasscode(reservationId, roomId);
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
  }, [reservationId, roomId]);

  return (
    <div className="unlock-room">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>Unlock Failed</h1>
      </div>
      <div className="room-number">
        <span>Room Number: {roomId}</span>
      </div>
      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>
        <button className="unlock-button unlocked" disabled>
          {buttonText}
        </button>
        {/* <div className="bottom-navigation">
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
        </div> */}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default UnlockFailed;
