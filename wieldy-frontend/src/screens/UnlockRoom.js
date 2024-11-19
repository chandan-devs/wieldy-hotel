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
import Loading from "../screens/Loading";

const UnlockRoom = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [buttonText, setButtonText] = useState("Click here to Unlock Now");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { reservationId, roomId } = useParams();

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await getHotelReservationById(reservationId);
        if (response.success) {
          setReservationData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };
    fetchReservationData();
  }, [reservationId]);

  const handleUnlock = async () => {
    if (!isUnlocked && reservationData) {
      setIsLoading(true);
      try {
        const token = reservationData.guestDetails.ttLockAccessToken;
        const response = await unlockDoor(token, roomId);

        if (response.success) {
          setButtonText("Room has been unlocked Successfully");
          setIsUnlocked(true);
          navigate(`/unlock-success/${roomId}`);
        } else {
          navigate(`/unlock-failed/${reservationId}/${roomId}`);
        }
      } catch (error) {
        console.error("Error unlocking door:", error);
        setButtonText("Failed to unlock. Fetching passcode...");
        navigate(`/unlock-failed/${reservationId}/${roomId}`);

        // try {
        //   const passcodeResponse = await getPasscode(reservationId, roomId);
        //   if (passcodeResponse && passcodeResponse.passcode) {
        //     setButtonText(
        //       `Unlocking Failed. Try Passcode: ${passcodeResponse.passcode}#`
        //     );
        //   } else {
        //     setButtonText(
        //       "Failed to retrieve passcode. Please contact support."
        //     );
        //   }
        // } catch (passcodeError) {
        //   console.error("Error fetching passcode:", passcodeError);
        //   setButtonText("Failed to retrieve passcode. Please contact support.");
        // }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
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
        <span>Room Number: {roomId}</span>
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

        {/* <div className="unlockRoom-bottom-navigation">
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

export default UnlockRoom;
