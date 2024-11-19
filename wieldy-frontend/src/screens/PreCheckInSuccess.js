import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotelReservations } from "../services/api";
import "../styles/PreCheckInSuccess.css";

const PreCheckInSuccess = () => {
  const [reservationData, setReservationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservationData();
  }, []);

  const fetchReservationData = async () => {
    try {
      const data = await getHotelReservations();
      setReservationData(data);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
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
  return (
    <div className="pre-checkin-success__container">
      <div className="pre-checkin-success__header">
        <header className="pre-checkin-success__title">
          <h1>Pre Check-in</h1>
        </header>
      </div>

      <div className="pre-checkin-success__card">
        <button className="pre-checkin-success__close-button">×</button>
        <div className="pre-checkin-success__content">
          <div className="pre-checkin-success__check-icon">✓</div>
          <h2 className="pre-checkin-success__heading">
            Pre Check-in Completed Successfully!
          </h2>
          <p className="pre-checkin-success__details">
            We have successfully received your Details and sent to the Property.
          </p>
          <p className="pre-checkin-success__note">
            Note: You can only access your key 30 minutes before the check-in
            time
          </p>
          <button
            className="pre-checkin-success__details-button"
            onClick={handleBookingDetails}
          >
            Go to Booking Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreCheckInSuccess;
