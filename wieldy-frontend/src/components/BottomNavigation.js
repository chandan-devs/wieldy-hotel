import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";
import "../styles/BottomNavigation.css";
import Loading from "./Loading";
import { getHotelReservations } from "../services/api";

const BottomNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reservationData, setReservationData] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
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

  const handleNavigation = (path) => {
    if (
      reservationData &&
      reservationData.data &&
      reservationData.data.length > 0
    ) {
      const isPreCheckin = reservationData.data[0].isPreCheckin;
      const reservationId = reservationData.data[0].bookingDetails._id;

      if (isPreCheckin) {
        if (path === "bookingdetails") {
          navigate(`/bookingdetails/${reservationId}`);
        } else if (path === "unlocking-details") {
          navigate(`/unlocking-details/${reservationId}`);
        }
      } else {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
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
    <>
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
          onClick={() => handleNavigation("bookingdetails")}
        >
          <img src={checkIn} alt="Check In" />
          <div className="active-line"></div>
        </button>
        <button
          className={isActive("/unlocking-details") ? "active" : ""}
          onClick={() => handleNavigation("unlocking-details")}
        >
          <img src={key} alt="Key" />
          <div className="active-line"></div>
        </button>
        <button
          className={isActive("/help-support") ? "active" : ""}
          onClick={() => navigate("/help-support")}
        >
          <img src={help} alt="Help" />
          <div className="active-line"></div>
        </button>
      </div>
      {showMessage && (
        <div className="gd-service-message">
          Please Complete Proceed to Pre Check-In
        </div>
      )}
    </>
  );
};

export default BottomNavigation;
