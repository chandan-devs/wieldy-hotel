// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { Calendar, Users, User, LogOut } from "lucide-react";
// import "../styles/BookingDetailsScreen.css";
// import hotelImg from "../assets/hotel-checkIn-img.jpg";
// import { getHotelReservationById } from "../services/api";
// import home from "../assets/navIcons/Home.png";
// import checkIn from "../assets/navIcons/checkIn.png";
// import key from "../assets/navIcons/key.png";
// import help from "../assets/navIcons/help.png";

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

//   // const handleLogout = () => {
//   //   localStorage.removeItem("token");
//   //   navigate("/");
//   // };

//   if (!reservationDetails) {
//     return <div>Loading...</div>;
//   }

//   const { hotelDetails, bookingDetails, guestDetails } = reservationDetails;

//   return (
//     <div className="container">
//       {/* <div className="header">
//         <div className="profile-image" onClick={handleLogout}>
//           <LogOut size={24} />
//         </div>
//         <div className="location-icon">
//           <span>{`${hotelDetails.propertyLocation.street}, ${hotelDetails.propertyLocation.city}`}</span>
//         </div>
//       </div> */}

//       <h1>Booking Details</h1>

//       <div className="hotel-card">
//         <img
//           src={hotelDetails.propertyImage || hotelImg}
//           alt={hotelDetails.propertyName}
//           className="hotel-image"
//         />
//         <div className="hotel-name">{hotelDetails.propertyName}</div>
//       </div>

//       <div className="booking-section">
//         <h2>Booking Details:</h2>
//         <div className="details-card">
//           <div className="detail-item">
//             <Calendar size={20} />
//             <span>Dates</span>
//             <span className="detail-value">{`${bookingDetails.checkInDate} - ${bookingDetails.checkOutDate}`}</span>
//           </div>

//           <div className="detail-item">
//             <Users size={20} />
//             <span>Guests</span>
//             <span className="detail-value">{`${bookingDetails.rooms.length} room(s)`}</span>
//           </div>

//           <div className="detail-item">
//             <User size={20} />
//             <span>Booking For</span>
//             <span className="detail-value">{`${guestDetails.personName.givenName} ${guestDetails.personName.surname}`}</span>
//           </div>
//         </div>
//       </div>
//       <div className="unlockbtn">
//         <Link to="#">
//           <button className="unlock-button">See Unlocking Details</button>
//         </Link>
//       </div>

//       <div className="bottom-navigation">
//         <button onClick={() => navigate("/dashboard")}>
//           <img src={home} alt="Home" />
//         </button>
//         <button>
//           <img src={checkIn} alt="Check In" />
//         </button>
//         <button>
//           <img src={key} alt="Key" />
//         </button>
//         <button>
//           <img src={help} alt="Help" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookingDetails;

// -----------------------------------------------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, User } from "lucide-react";
import "../styles/BookingDetails.css";
import hotelImg from "../assets/hotel-checkIn-img.jpg";
import { getHotelReservationById, getUnlockingDetails } from "../services/api";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

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
      // Fetch unlocking details from the API
      const unlockingData = await getUnlockingDetails(reservationId);

      // Store the unlocking data in localStorage or state management
      localStorage.setItem("unlockingDetails", JSON.stringify(unlockingData));

      // Redirect to the UnlockingDetails page
      navigate(`/unlocking-details/${reservationId}`);
    } catch (error) {
      console.error("Failed to fetch unlocking details", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  if (!reservationDetails) {
    return <div>Loading...</div>;
  }

  const { hotelDetails, bookingDetails, guestDetails } = reservationDetails;

  return (
    <div className="container">
      <h1>Booking Details</h1>

      <div className="hotel-card">
        <img
          src={hotelDetails.propertyImage || hotelImg}
          alt={hotelDetails.propertyName}
          className="hotel-image"
        />
        <div className="hotel-name">{hotelDetails.propertyName}</div>
      </div>

      <div className="booking-section">
        <h2>Booking Details:</h2>
        <div className="details-card">
          <div className="detail-item">
            <Calendar size={20} />
            <span>Dates</span>
            <span className="detail-value">{`${bookingDetails.checkInDate} - ${bookingDetails.checkOutDate}`}</span>
          </div>

          <div className="detail-item">
            <Users size={20} />
            <span>Guests</span>
            <span className="detail-value">{`${bookingDetails.rooms.length} room(s)`}</span>
          </div>

          <div className="detail-item">
            <User size={20} />
            <span>Booking For</span>
            <span className="detail-value">{`${guestDetails.personName.givenName} ${guestDetails.personName.surname}`}</span>
          </div>
        </div>
      </div>
      <div className="unlockbtn">
        <button className="unlock-button" onClick={handleSeeUnlockingDetails}>
          See Unlocking Details
        </button>
      </div>

      <div className="bottom-navigation">
        <button onClick={() => navigate("/dashboard")}>
          <img src={home} alt="Home" />
        </button>
        <button>
          <img src={checkIn} alt="Check In" />
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

export default BookingDetails;
