import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  getHotelReservationById,
  unlockDoor,
  getPasscode,
  checkIn,
} from "../services/api";
import UnlockingPreloader from "../components/UnlockingPreloader";
import BottomNavigation from "../components/BottomNavigation";
import "../styles/UnlockingDetails.css";
import hotelImg from "../assets/hotel-checkIn-img.jpg";

const UnlockingDetails = () => {
  const [reservationData, setReservationData] = useState(null);
  const [canUnlock, setCanUnlock] = useState(false);
  const [redirectToHelpSupport, setRedirectToHelpSupport] = useState(false);
  const [buttonText, setButtonText] = useState("Tap to Unlock Front Door");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState("");
  const [isDoorKeypad, setIsDoorKeypad] = useState(true);
  const [isUnlockingPreloader, setIsUnlockingPreloader] = useState(false);
  // eslint-disable-next-line
  const [passcodeProvided, setPasscodeProvided] = useState(false);
  // eslint-disable-next-line
  const [canUnlockRooms, setCanUnlockRooms] = useState(false);
  // eslint-disable-next-line
  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(false);
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.canUnlockRooms) {
      setCanUnlockRooms(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await getHotelReservationById(reservationId);
        if (response.success) {
          setReservationData(response.data[0]);
          checkUnlockingTime(response.data[0]);
          setIsDoorKeypad(response.data[0].hotelDetails.isDoorKeypad);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };
    fetchReservationData();
    setCanUnlockRooms(false);
    // eslint-disable-next-line
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
    // setCanUnlockRooms(canUnlock);

    if (!canUnlock) {
      updateUnlockMessage(now, halfHourBeforeCheckIn);
    }
  };

  const updateUnlockMessage = (now, unlockTime) => {
    const timeDiff = unlockTime.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 0) {
      setButtonText(`Unlock will be available in ${daysDiff} day(s)`);
    } else {
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      if (minutesDiff > 0) {
        setButtonText(`Unlock available in ${minutesDiff} minute(s)`);
      } else {
        setButtonText("Unlock available 30 min before check-in");
      }
    }
  };

  // const handleUnlock = async () => {
  //   console.log("Current canUnlock state:", canUnlock);
  //   console.log("Current isUnlocked state:", isUnlocked);
  //   if (canUnlock && !isUnlocked) {
  //     setIsUnlockingPreloader(true);
  //     try {
  //       const token = reservationData.guestDetails.ttLockAccessToken;
  //       const room = "2025";
  //       const response = await unlockDoor(token, room);

  //       if (response.success) {
  //         setButtonText("Front Door Has Been Unlocked Successfully!");

  //         setIsUnlocked(true);
  //         setFrontDoorUnlocked(true);
  //         setCanUnlockRooms(true);
  //       } else {
  //         throw new Error("Unlock failed");
  //       }
  //     } catch (error) {
  //       console.error("Error unlocking door:", error);
  //       setButtonText("Failed to unlock. Fetching passcode...");

  //       if (!isDoorKeypad) {
  //         navigate(`/unlock-failed-help-support/${reservationId}`);
  //       } else {
  //         setButtonText("Failed to unlock. Fetching passcode...");

  //         try {
  //           const passcodeResponse = await getPasscode(reservationId, "2024");
  //           if (passcodeResponse && passcodeResponse.passcode) {
  //             const passcodeMessage = `Unlocking Failed. Try Passcode: ${passcodeResponse.passcode}#`;
  //             setButtonText(passcodeMessage);

  //             setPasscodeProvided(true);
  //             setCanUnlockRooms(true);
  //           } else {
  //             throw new Error("Failed to get passcode");
  //           }
  //         } catch (passcodeError) {
  //           console.error("Error fetching passcode:", passcodeError);
  //           setButtonText("Failed to get passcode. Please try again.");
  //         }
  //       }
  //     } finally {
  //       setIsUnlockingPreloader(false);
  //     }
  //   } else if (!canUnlock) {
  //     console.log("Cannot unlock yet");
  //   } else {
  //     console.log("Door is already unlocked");
  //   }
  // };

  const handleUnlock = async () => {
    if (redirectToHelpSupport) {
      navigate("/help-support");
      return;
    }

    console.log("Current canUnlock state:", canUnlock);
    console.log("Current isUnlocked state:", isUnlocked);
    if (canUnlock && !isUnlocked) {
      setIsUnlockingPreloader(true);
      try {
        const token = reservationData.guestDetails.ttLockAccessToken;
        const room = "2024";

        const unlockPromise = unlockDoor(token, room);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Unlock operation timed out")),
            5000
          )
        );

        const response = await Promise.race([unlockPromise, timeoutPromise]);

        if (response.success) {
          setButtonText("Front Door Has Been Unlocked Successfully!");
          setIsUnlocked(true);
          setFrontDoorUnlocked(true);
          setCanUnlockRooms(true);
        } else {
          throw new Error("Unlock failed");
        }
      } catch (error) {
        console.error("Error unlocking door:", error);

        if (!isDoorKeypad) {
          setButtonText("Unlocking Failed, Connect To Support Team.");
          setRedirectToHelpSupport(true);
        } else {
          setButtonText("Failed to unlock. Fetching passcode...");

          try {
            const passcodeResponse = await getPasscode(reservationId, "2024");
            if (passcodeResponse && passcodeResponse.passcode) {
              const passcodeMessage = `Unlocking Failed. Try Passcode: ${passcodeResponse.passcode}#`;
              setButtonText(passcodeMessage);
              setPasscodeProvided(true);
              setCanUnlockRooms(true);
            } else {
              throw new Error("Failed to get passcode");
            }
          } catch (passcodeError) {
            console.error("Error fetching passcode:", passcodeError);
            setButtonText("Failed to get passcode. Please try again.");
          }
        }
      } finally {
        setIsUnlockingPreloader(false);
      }
    } else if (!canUnlock) {
      console.log("Cannot unlock yet");
    } else {
      console.log("Door is already unlocked");
    }
  };

  const handleRoomClick = async (roomName) => {
    if (!reservationData) return;

    const { bookingDetails, hotelDetails } = reservationData;

    // if (!canUnlockRooms) {
    //   setCheckInMessage(
    //     "Please unlock the front door first before accessing the rooms."
    //   );
    //   return;
    // }

    const payload = {
      bookingid: bookingDetails._id,
      reservationid: bookingDetails.reservationId,
      propertyID: hotelDetails.propertyId,
    };

    setIsUnlockingPreloader(true);

    try {
      const token = localStorage.getItem("token");
      const response = await checkIn(payload, token);

      if (response.success) {
        navigate(`/unlock-room/${reservationId}/${roomName}`);
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
          navigate(`/unlock-room/${reservationId}/${roomName}`);
        } else {
          setCheckInMessage(
            response.message ||
              "An error occurred during check-in. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setCheckInMessage("An error occurred during check-in. Please try again.");
    } finally {
      setIsUnlockingPreloader(false);
    }
  };

  if (!reservationData || isUnlockingPreloader) {
    return <UnlockingPreloader />;
  }

  const { hotelDetails, bookingDetails } = reservationData;

  return (
    <div className="container">
      <p className="UnlockingDetailHeading">Unlocking Details</p>

      <div className="unlocking-hotel-card">
        <img
          src={hotelDetails.propertyImage || hotelImg}
          alt={hotelDetails.propertyName}
          className="hotel-image"
        />
        <div className="hotel-overlay"></div>
        <div className="hotel-name">{hotelDetails.propertyName}</div>
      </div>

      <div className="frontdoor-btn">
        <h3>Front Door Key:</h3>
        {hotelDetails.isFrontDoor && (
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
          </div>
        )}
      </div>

      <div className="room-list">
        <h3>Room List:</h3>
        {bookingDetails.rooms.map((room) => (
          <button
            key={room.roomName}
            className="room-item"
            onClick={() => handleRoomClick(room.roomName)}

            // className={`room-item ${canUnlockRooms ? "" : "disabled"}`}
            // onClick={() => handleRoomClick(room.roomName)}
            // disabled={!canUnlockRooms}
          >
            <span className="room-item-text">Room Number: {room.roomName}</span>
            <span className="arrow">
              <ChevronRight />
            </span>
          </button>
        ))}
      </div>

      {checkInMessage && <p className="check-in-message">{checkInMessage}</p>}

      <BottomNavigation />
    </div>
  );
};

export default UnlockingDetails;
