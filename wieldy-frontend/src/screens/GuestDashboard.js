import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHotelReservations } from "../services/api";
import { LogOut, MapPin, Bell } from "lucide-react";
import Loading from "../components/Loading";
import BottomNavigation from "../components/BottomNavigation";
import hotelImg from "../assets/hotel-checkIn-img.jpg";
import bodySpaImg from "../assets/body-spa-img.jpg";
import breakfastImg from "../assets/breakfast-img.jpg";
import cabImg from "../assets/cab-img.jpg";
import luxuryImg from "../assets/luxury-room-img.jpg";
import "../styles/GuestDashboard.css";

function GuestDashboard() {
  const [reservationData, setReservationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservationData();
  }, []);

  const fetchReservationData = async () => {
    try {
      setIsLoading(true);
      const data = await getHotelReservations();
      setReservationData(data);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("responseData");
    localStorage.removeItem("unlockingDetails");
    navigate("/");
  };

  const handlePreCheckIn = () => {
    if (
      reservationData &&
      reservationData.data &&
      reservationData.data.length > 0
    ) {
      const isPreCheckin = reservationData.data[0].isPreCheckin;
      const reservationId = reservationData.data[0].bookingDetails._id;

      if (isPreCheckin) {
        navigate(`/bookingdetails/${reservationId}`);
      } else {
        navigate(`/pre-check-in/${reservationId}`);
      }
    } else {
      console.error("No reservation data available");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="gd-app-container">
      <Header onLogout={handleLogout} reservationData={reservationData} />
      <WelcomeCard
        reservationData={reservationData}
        onProceedCheckIn={handlePreCheckIn}
      />
      <Picks />
      <BottomNavigation />
    </div>
  );
}

const Header = ({ onLogout, reservationData }) => {
  const propertyLocation =
    reservationData?.data?.[0]?.hotelDetails?.propertyLocation;
  const locationString = propertyLocation
    ? `${propertyLocation.city}, ${propertyLocation.country}`
    : "Location not available";

  return (
    <div className="gd-dashboard-header">
      <div className="gd-profile-image" onClick={onLogout}>
        <LogOut size={24} />
      </div>
      <div className="gd-location-icon">
        <MapPin size={24} />
        <span>{locationString}</span>
      </div>
      <div className="gd-notification-icon">
        <Bell size={24} />
      </div>
    </div>
  );
};

const WelcomeCard = ({ reservationData, onProceedCheckIn }) => {
  const guestName =
    reservationData?.data?.[0]?.guestDetails?.personName?.givenName || "Guest";
  const propertyName =
    reservationData?.data?.[0]?.hotelDetails?.propertyName || "Hotel";
  const propertyImage =
    reservationData?.data?.[0]?.hotelDetails?.propertyImage?.[0]?.image ||
    hotelImg;
  const isPreCheckin = reservationData?.data?.[0]?.isPreCheckin || false;

  return (
    <div
      className="gd-welcome-card"
      style={{ backgroundImage: `url(${propertyImage})` }}
    >
      <div className="gd-welcome-content">
        <h2>Welcome {guestName}</h2>
        <div className="gd-checkin-btn">
          <p>We are waiting to welcome you!</p>
          <button className="gd-checkin-button" onClick={onProceedCheckIn}>
            {isPreCheckin ? "Go To Booking Details" : "Proceed to Pre Check-In"}
          </button>
        </div>
        <p className="gd-account-name">{propertyName}</p>
      </div>
    </div>
  );
};

const Picks = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handlePickClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="gd-picks">
      <h3>Top Picks for You</h3>
      <div className="gd-pick-options">
        <div className="gd-pick-option" onClick={handlePickClick}>
          <img src={luxuryImg} alt="Room Upgrades" />
          <div className="gd-overlay">
            <p>Room Upgrades</p>
          </div>
        </div>
        <div className="gd-pick-option" onClick={handlePickClick}>
          <img src={breakfastImg} alt="Order Breakfast" />
          <div className="gd-overlay">
            <p>Order Breakfast</p>
          </div>
        </div>
        <div className="gd-pick-option" onClick={handlePickClick}>
          <img src={bodySpaImg} alt="Body Spa" />
          <div className="gd-overlay">
            <p>Body Spa</p>
          </div>
        </div>
        <div className="gd-pick-option" onClick={handlePickClick}>
          <img src={cabImg} alt="Book a Cab" />
          <div className="gd-overlay">
            <p>Book a Cab</p>
          </div>
        </div>
      </div>
      {showMessage && (
        <div className="gd-service-message">
          This service will be available soon.
        </div>
      )}
    </div>
  );
};

export default GuestDashboard;
