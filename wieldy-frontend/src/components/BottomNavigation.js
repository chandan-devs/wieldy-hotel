import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";
import "../styles/BottomNavigation.css";
import Loading from "../screens/Loading";
import { getHotelReservations } from "../services/api";

const BottomNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reservationData, setReservationData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleBookingDetails = () => {
    if (
      reservationData &&
      reservationData.data &&
      reservationData.data.length > 0
    ) {
      const guestId = reservationData.data[0].bookingDetails._id;
      navigate(`/bookingdetails/${guestId}`);
    } else {
      console.error("No reservation data available");
    }
  };

  const handleUnlockingDetails = () => {
    if (
      reservationData &&
      reservationData.data &&
      reservationData.data.length > 0
    ) {
      const reservationId = reservationData.data[0].bookingDetails._id;
      navigate(`/unlocking-details/${reservationId}`);
    } else {
      console.error("No reservation data available");
    }
  };

  const isActive = (path) => {
    if (path === "/bookingdetails") {
      return location.pathname.includes("/bookingdetails");
    }
    if (path === "/unlocking-details") {
      return location.pathname.includes("/unlocking-details");
    }
    return location.pathname === path;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bottom-navigation">
      <button
        className={isActive("/dashboard") ? "active" : ""}
        onClick={() => navigate("/dashboard")}
      >
        <img src={home} alt="Home" />
        <div className="active-line"></div>
      </button>
      <button
        className={isActive("/bookingdetails") ? "active" : ""}
        onClick={handleBookingDetails}
      >
        <img src={checkIn} alt="Check In" />
        <div className="active-line"></div>
      </button>
      <button
        className={isActive("/unlocking-details") ? "active" : ""}
        onClick={handleUnlockingDetails}
      >
        <img src={key} alt="Key" />
        <div className="active-line"></div>
      </button>
      <button
        className={isActive("/help-and-support") ? "active" : ""}
        onClick={() => navigate("/help-and-support")}
      >
        <img src={help} alt="Help" />
        <div className="active-line"></div>
      </button>
    </div>
  );
};

export default BottomNavigation;
