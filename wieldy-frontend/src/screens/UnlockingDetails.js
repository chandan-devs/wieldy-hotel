import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getHotelReservationById,
  unlockDoor,
  getPasscode,
  checkIn,
} from "../services/api";
import "../styles/UnlockingDetails.css";
import hotelImg from "../assets/hotel-checkIn-img.jpg";
import home from "../assets/navIcons/Home.png";
import checkInIcon from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

const UnlockingDetails = () => {
  const [reservationData, setReservationData] = useState(null);
  const [canUnlock, setCanUnlock] = useState(false);
  const [buttonText, setButtonText] = useState("Tap to Unlock Front Door");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState("");
  const [passcodeProvided, setPasscodeProvided] = useState(false);
  const [canUnlockRooms, setCanUnlockRooms] = useState(false);
  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(false);
  const [passcode, setPasscode] = useState(null);
  // const [message, setMessage] = useState("");
  const { reservationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await getHotelReservationById(reservationId);
        if (response.success) {
          setReservationData(response.data[0]);
          checkUnlockingTime(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };
    fetchReservationData();
    setCanUnlockRooms(false);
  }, [reservationId]);

  const checkUnlockingTime = (data) => {
    const now = new Date();
    const checkInTime = new Date(
      data.bookingDetails.checkInDate +
        "T" +
        data.hotelDetails.defaultCheckInTime
    );
    const checkOutTime = new Date(
      data.bookingDetails.checkOutDate +
        "T" +
        data.hotelDetails.defaultCheckOutTime
    );
    const halfHourBeforeCheckIn = new Date(checkInTime.getTime() - 30 * 60000);

    const canUnlock = now >= halfHourBeforeCheckIn && now <= checkOutTime;
    console.log("Can unlock:", canUnlock);
    setCanUnlock(canUnlock);
    setCanUnlockRooms(canUnlock);

    if (!canUnlock) {
      updateUnlockMessage(now, halfHourBeforeCheckIn);
    }
  };

  const updateUnlockMessage = (now, unlockTime) => {
    const timeDiff = unlockTime.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 0) {
      setButtonText(`Unlock will be available in ${daysDiff} day(s)`);
      // setMessage(`Unlock will be available in ${daysDiff} day(s)`);
    } else {
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      if (minutesDiff > 0) {
        setButtonText(`Unlock available in ${minutesDiff} minute(s)`);
        // setMessage(`Unlock available in ${minutesDiff} minute(s)`);
      } else {
        setButtonText("Unlock available 30 min before check-in");
        // setMessage("Unlock available 30 min before check-in");
      }
    }
  };

  const handleUnlock = async () => {
    console.log("Current canUnlock state:", canUnlock);
    console.log("Current isUnlocked state:", isUnlocked);
    if (canUnlock && !isUnlocked) {
      // setMessage("Attempting to unlock the door...");
      try {
        const token = reservationData.guestDetails.ttLockAccessToken;
        const room = "2024"; // Fixed room number for front door
        const response = await unlockDoor(token, room);

        if (response.success) {
          setButtonText("Front Door Has Been Unlocked Successfully!");
          // setMessage("Front Door Has Been Unlocked Successfully!");
          setIsUnlocked(true);
          setFrontDoorUnlocked(true);
        } else {
          throw new Error("Unlock failed");
        }
      } catch (error) {
        console.error("Error unlocking door:", error);
        setButtonText("Failed to unlock. Fetching passcode...");
        // setMessage("Failed to unlock. Fetching passcode...");

        try {
          const passcodeResponse = await getPasscode(reservationId, "2024");
          if (passcodeResponse && passcodeResponse.passcode) {
            const passcodeMessage = `Unlocking Failed. Try Passcode: ${passcodeResponse.passcode}#`;
            setButtonText(passcodeMessage);
            // setMessage(passcodeMessage);
            setPasscodeProvided(true);
          } else {
            throw new Error("Failed to get passcode");
          }
        } catch (passcodeError) {
          console.error("Error fetching passcode:", passcodeError);
          setButtonText("Failed to get passcode. Please try again.");
          // setMessage("Failed to get passcode. Please try again.");
        }
      }
    } else if (!canUnlock) {
      // The message is already set in checkUnlockingTime, so we don't need to do anything here
      console.log("Cannot unlock yet");
    } else {
      console.log("Door is already unlocked");
    }
  };

  const handleRoomClick = async (roomId) => {
    // if (!reservationData || !frontDoorUnlocked) return;

    if (!reservationData) return;

    const { bookingDetails, hotelDetails } = reservationData;

    // Check if the room can be unlocked
    if (!hotelDetails.isDoorKeypad && !canUnlockRooms) {
      setCheckInMessage(
        "Room unlock is not available yet. Please wait until 30 minutes before check-in time."
      );
      return;
    }

    const payload = {
      bookingid: bookingDetails._id,
      reservationid: bookingDetails.reservationId,
      propertyID: hotelDetails.propertyId,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await checkIn(payload, token);

      if (response.success) {
        navigate(`/unlock-room/${reservationId}/${roomId}`);
      } else {
        if (
          response.message === "Your Payment is due, Kindly pay at Reception."
        ) {
          setCheckInMessage(response.message);
        } else if (
          response.message ===
          "Room check-in issue. Ensure previous checkouts are complete."
        ) {
          setCheckInMessage(response.message);
          navigate(`/unlock-room/${reservationId}/${roomId}`);
        } else {
          // For any other error messages
          setCheckInMessage(
            response.message ||
              "An error occurred during check-in. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setCheckInMessage("An error occurred during check-in. Please try again.");
    }
  };

  if (!reservationData) {
    return <div>Loading...</div>;
  }

  const { hotelDetails, bookingDetails } = reservationData;

  return (
    <div className="container">
      <h1>Unlocking Details</h1>

      <div className="hotel-card">
        <img
          src={hotelDetails.propertyImage || hotelImg}
          alt={hotelDetails.propertyName}
          className="hotel-image"
        />
        <div className="hotel-name">{hotelDetails.propertyName}</div>
      </div>

      {hotelDetails.isDoorKeypad && (
        <div className="unlockbtn">
          <button
            className={`unlock-button-frontdoor ${
              !canUnlock || isUnlocked ? "disabled" : ""
            }`}
            onClick={handleUnlock}
            disabled={!canUnlock || isUnlocked}
          >
            {buttonText}
          </button>
          {/* {message && <p className="unlock-message">{message}</p>} */}
        </div>
      )}

      <div className="room-list">
        <h2>Room List</h2>
        {/* {bookingDetails.rooms.map((room) => (
          <button
            key={room.roomId}
            className={`room-item ${
              frontDoorUnlocked || passcodeProvided ? "" : "disabled"
            }`}
            onClick={() => handleRoomClick(room.roomId)}
            disabled={!(frontDoorUnlocked || passcodeProvided)}
          > */}
        {bookingDetails.rooms.map((room) => (
          <button
            key={room.roomId}
            className={`room-item ${
              (hotelDetails.isDoorKeypad &&
                (frontDoorUnlocked || passcodeProvided)) ||
              (!hotelDetails.isDoorKeypad && canUnlockRooms)
                ? ""
                : "disabled"
            }`}
            onClick={() => handleRoomClick(room.roomId)}
            disabled={
              !(
                (hotelDetails.isDoorKeypad &&
                  (frontDoorUnlocked || passcodeProvided)) ||
                (!hotelDetails.isDoorKeypad && canUnlockRooms)
              )
            }
          >
            <span>Room Number: {room.roomId}</span>
            <span className="arrow">➔</span>
          </button>
        ))}
      </div>

      {!hotelDetails.isDoorKeypad && !canUnlockRooms && (
        <p className="unlock-message">
          Room unlocking will be available 30 minutes before check-in time.
        </p>
      )}

      {checkInMessage && <p className="check-in-message">{checkInMessage}</p>}

      <div className="bottom-navigation">
        <button onClick={() => navigate("/dashboard")}>
          <img src={home} alt="Home" />
        </button>
        <button onClick={() => navigate(`/bookingdetails/${reservationId}`)}>
          <img src={checkInIcon} alt="Check In" />
        </button>
        <button>
          <img src={key} alt="Key" />
        </button>
        <button>
          <img src={help} alt="Help" />
        </button>
      </div>
    </div>
  );
};

export default UnlockingDetails;
