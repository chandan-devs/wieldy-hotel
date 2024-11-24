// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Calendar, Users, User } from "lucide-react";
// import { getHotelReservationById, getUnlockingDetails } from "../services/api";
// import Loading from "../screens/Loading";
// import "../styles/BookingDetails.css";
// import BottomNavigation from "../components/BottomNavigation";
// import hotelImg from "../assets/hotel-checkIn-img.jpg";

// const BookingDetails = () => {
//   const [reservationDetails, setReservationDetails] = useState(null);
//   const { reservationId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchReservationDetails = async () => {
//       try {
//         const response = await getHotelReservationById(reservationId);
//         setReservationDetails(response.data[0]);
//       } catch (error) {
//         console.error("Failed to fetch reservation details", error);
//       }
//     };

//     if (reservationId) {
//       fetchReservationDetails();
//     }
//   }, [reservationId]);

//   const handleSeeUnlockingDetails = async () => {
//     try {
//       const unlockingData = await getUnlockingDetails(reservationId);

//       localStorage.setItem("unlockingDetails", JSON.stringify(unlockingData));

//       navigate(`/unlocking-details/${reservationId}`);
//     } catch (error) {
//       console.error("Failed to fetch unlocking details", error);
//     }
//   };

//   if (!reservationDetails) {
//     return <Loading />;
//   }

//   const { hotelDetails, bookingDetails, guestDetails } = reservationDetails;

//   return (
//     <div className="container">
//       <p className="bookingDetailHeading">Booking Details</p>

//       <div className="booking-hotel-card">
//         <img
//           src={hotelDetails.propertyImage || hotelImg}
//           alt={hotelDetails.propertyName}
//           className="hotel-image"
//         />
//         <div className="hotel-name">{hotelDetails.propertyName}</div>
//         <button
//           className="booking-unlock-button"
//           onClick={handleSeeUnlockingDetails}
//         >
//           See Unlocking Details
//         </button>
//       </div>

//       <div className="booking-section">
//         <h2>Booking Details:</h2>
//         <div className="booking-details-card">
//           <div className="booking-detail-item">
//             <Calendar size={20} />
//             <span>Dates</span>
//             <span className="detail-value">{`${bookingDetails.checkInDate} - ${bookingDetails.checkOutDate}`}</span>
//           </div>

//           <div className="booking-detail-item">
//             <Users size={20} />
//             <span>Guests</span>
//             <span className="detail-value">{`${bookingDetails.rooms.length} room(s)`}</span>
//           </div>

//           <div className="booking-detail-item">
//             <User size={20} />
//             <span>Booking For</span>
//             <span className="detail-value">{`${guestDetails.personName.givenName} ${guestDetails.personName.surname}`}</span>
//           </div>
//         </div>
//       </div>
//       {/* <div className="unlockbtn">
//         <button
//           className="booking-unlock-button"
//           onClick={handleSeeUnlockingDetails}
//         >
//           See Unlocking Details
//         </button>
//       </div> */}

//       <BottomNavigation />
//     </div>
//   );
// };

// export default BookingDetails;

// --------------------------------------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, User } from "lucide-react";
import { getHotelReservationById, getUnlockingDetails } from "../services/api";
import Loading from "../components/Loading";
import "../styles/BookingDetails.css";
import BottomNavigation from "../components/BottomNavigation";
import hotelImg from "../assets/hotel-checkIn-img.jpg";

const BookingDetails = () => {
  const [reservationDetails, setReservationDetails] = useState(null);
  const { reservationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await getHotelReservationById(reservationId);
        setReservationDetails(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch reservation details", error);
      }
    };

    if (reservationId) {
      fetchReservationDetails();
    }
  }, [reservationId]);

  const handleSeeUnlockingDetails = async () => {
    try {
      const unlockingData = await getUnlockingDetails(reservationId);
      localStorage.setItem("unlockingDetails", JSON.stringify(unlockingData));
      navigate(`/unlocking-details/${reservationId}`);
    } catch (error) {
      console.error("Failed to fetch unlocking details", error);
    }
  };

  if (!reservationDetails) {
    return <Loading />;
  }

  const { hotelDetails, bookingDetails, guestDetails } = reservationDetails;

  return (
    <div className="container">
      <p className="bookingDetailHeading">Booking Details</p>

      <div className="booking-hotel-card">
        <img
          src={hotelDetails.propertyImage || hotelImg}
          alt={hotelDetails.propertyName}
          className="hotel-image"
        />
        <div className="hotel-overlay">
          <div className="hotel-name">{hotelDetails.propertyName}</div>
          <button
            className="booking-unlock-button"
            onClick={handleSeeUnlockingDetails}
          >
            See Unlocking Details
          </button>
        </div>
      </div>

      <div className="booking-section">
        <h2>Booking Details:</h2>
        <div className="booking-details-card">
          <div className="booking-detail-item">
            <Calendar size={20} />
            <span>Dates</span>
            <span className="detail-value">{`${bookingDetails.checkInDate} - ${bookingDetails.checkOutDate}`}</span>
          </div>

          <div className="booking-detail-item">
            <Users size={20} />
            <span>Guests</span>
            <span className="detail-value">{`${bookingDetails.rooms.length} room(s)`}</span>
          </div>

          <div className="booking-detail-item">
            <User size={20} />
            <span>Booking For</span>
            <span className="detail-value">{`${guestDetails.personName.givenName} ${guestDetails.personName.surname}`}</span>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BookingDetails;
