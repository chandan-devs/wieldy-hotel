// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getHotelReservations } from "../services/api";
// import { LogOut, MapPin, Bell } from "lucide-react";
// import hotelImg from "../assets/hotel-checkIn-img.jpg";
// import bodySpaImg from "../assets/body-spa-img.jpg";
// import breakfastImg from "../assets/breakfast-img.jpg";
// import cabImg from "../assets/cab-img.jpg";
// import luxuryImg from "../assets/luxury-room-img.jpg";
// import home from "../assets/navIcons/Home.png";
// import checkIn from "../assets/navIcons/checkIn.png";
// import key from "../assets/navIcons/key.png";
// import help from "../assets/navIcons/help.png";
// import "../styles/GuestDashboard.css";

// function GuestDashboard() {
//   const [reservationData, setReservationData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchReservationData();
//   }, []);

//   const fetchReservationData = async () => {
//     try {
//       const data = await getHotelReservations();
//       setReservationData(data);
//     } catch (error) {
//       console.error("Error fetching reservation data:", error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("responseData");
//     localStorage.removeItem("unlockingDetails");
//     navigate("/");
//   };

//   // const PreCheckInForm = () => {
//   //   navigate(`/pre-check-in`);
//   // };

//   const handleBookingDetails = () => {
//     if (
//       reservationData &&
//       reservationData.data &&
//       reservationData.data.length > 0
//     ) {
//       const guestId = reservationData.data[0].bookingDetails._id;
//       navigate(`/bookingdetails/${guestId}`);
//     } else {
//       console.error("No reservation data available");
//     }
//   };

//   const handlePreCheckIn = () => {
//     if (
//       reservationData &&
//       reservationData.data &&
//       reservationData.data.length > 0
//     ) {
//       const reservationId =
//         reservationData.data[0].bookingDetails.reservationId;
//       navigate(`/pre-check-in/${reservationId}`);
//     } else {
//       console.error("No reservation data available");
//     }
//   };

//   return (
//     <div className="app-container">
//       <Header onLogout={handleLogout} />
//       <WelcomeCard
//         reservationData={reservationData}
//         // onProceedCheckIn={PreCheckInForm}
//         onProceedCheckIn={handlePreCheckIn}
//       />
//       <Picks />
//       <BottomNavigation
//         onHomeClick={fetchReservationData}
//         // onCheckInClick={handleProceedCheckIn}
//         onBookingDetails={handleBookingDetails}
//       />
//     </div>
//   );
// }

// const Header = ({ onLogout }) => {
//   return (
//     <div className="dashboard-header">
//       <div className="profile-image" onClick={onLogout}>
//         <LogOut size={24} />
//       </div>
//       <div className="location-icon">
//         <MapPin size={24} />
//         <span>AA, San Diego</span>
//       </div>
//       <div className="notification-icon">
//         <Bell size={24} />
//       </div>
//     </div>
//   );
// };

// const WelcomeCard = ({ reservationData, onProceedCheckIn }) => {
//   const guestName =
//     reservationData &&
//     reservationData.data &&
//     reservationData.data.length > 0 &&
//     reservationData.data[0].guestDetails &&
//     reservationData.data[0].guestDetails.personName
//       ? reservationData.data[0].guestDetails.personName.givenName
//       : "Guest";

//   return (
//     <div
//       className="welcome-card"
//       style={{ backgroundImage: `url(${hotelImg})` }}
//     >
//       <div className="welcome-content">
//         <h2>Welcome {guestName}</h2>
//         <div className="checkInBtn">
//           <p>We are waiting to onboard you. Enjoy your stay!</p>
//           <button className="checkin-button" onClick={onProceedCheckIn}>
//             Proceed for Check-In
//           </button>
//         </div>
//         <p className="account-name">Wieldy demo account</p>
//       </div>
//     </div>
//   );
// };

// const Picks = () => {
//   return (
//     <div className="picks">
//       <h3>Top Picks for You</h3>
//       <div className="pick-options">
//         <div className="pick-option">
//           <img src={luxuryImg} alt="Room Upgrades" />
//           <div className="overlay">
//             <p>Room Upgrades</p>
//           </div>
//         </div>
//         <div className="pick-option">
//           <img src={breakfastImg} alt="Order Breakfast" />
//           <div className="overlay">
//             <p>Order Breakfast</p>
//           </div>
//         </div>
//         <div className="pick-option">
//           <img src={bodySpaImg} alt="Body Spa" />
//           <div className="overlay">
//             <p>Body Spa</p>
//           </div>
//         </div>
//         <div className="pick-option">
//           <img src={cabImg} alt="Book a Cab" />
//           <div className="overlay">
//             <p>Book a Cab</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const BottomNavigation = ({ onHomeClick, onBookingDetails }) => {
//   return (
//     <div className="bottom-navigation">
//       <button onClick={onHomeClick}>
//         <img src={home} alt="Home" />
//       </button>
//       <button onClick={onBookingDetails}>
//         <img src={checkIn} alt="Check In" />
//       </button>
//       <button>
//         <img src={key} alt="Key" />
//       </button>
//       <button>
//         <img src={help} alt="Help" />
//       </button>
//     </div>
//   );
// };

// export default GuestDashboard;

// --------------------------------------------------------

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHotelReservations } from "../services/api";
import { LogOut, MapPin, Bell } from "lucide-react";
import Loading from "./Loading";
import BottomNavigation from "../components/BottomNavigation";
import hotelImg from "../assets/hotel-checkIn-img.jpg";
import bodySpaImg from "../assets/body-spa-img.jpg";
import breakfastImg from "../assets/breakfast-img.jpg";
import cabImg from "../assets/cab-img.jpg";
import luxuryImg from "../assets/luxury-room-img.jpg";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";
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

  // const handleBookingDetails = () => {
  //   if (
  //     reservationData &&
  //     reservationData.data &&
  //     reservationData.data.length > 0
  //   ) {
  //     const guestId = reservationData.data[0].bookingDetails._id;
  //     navigate(`/bookingdetails/${guestId}`);
  //   } else {
  //     console.error("No reservation data available");
  //   }
  // };

  const handlePreCheckIn = () => {
    if (
      reservationData &&
      reservationData.data &&
      reservationData.data.length > 0
    ) {
      const reservationId =
        reservationData.data[0].bookingDetails.reservationId;
      navigate(`/pre-check-in/${reservationId}`);
    } else {
      console.error("No reservation data available");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="gd-app-container">
      <Header onLogout={handleLogout} />
      <WelcomeCard
        reservationData={reservationData}
        onProceedCheckIn={handlePreCheckIn}
      />
      <Picks />
      {/* <BottomNavigation
        onHomeClick={fetchReservationData}
        onBookingDetails={handleBookingDetails}
      /> */}
      <BottomNavigation />
    </div>
  );
}

const Header = ({ onLogout }) => {
  return (
    <div className="gd-dashboard-header">
      <div className="gd-profile-image" onClick={onLogout}>
        <LogOut size={24} />
      </div>
      <div className="gd-location-icon">
        <MapPin size={24} />
        <span>AA, San Diego</span>
      </div>
      <div className="gd-notification-icon">
        <Bell size={24} />
      </div>
    </div>
  );
};

const WelcomeCard = ({ reservationData, onProceedCheckIn }) => {
  const guestName =
    reservationData &&
    reservationData.data &&
    reservationData.data.length > 0 &&
    reservationData.data[0].guestDetails &&
    reservationData.data[0].guestDetails.personName
      ? reservationData.data[0].guestDetails.personName.givenName
      : "Guest";

  return (
    <div
      className="gd-welcome-card"
      style={{ backgroundImage: `url(${hotelImg})` }}
    >
      <div className="gd-welcome-content">
        <h2>Welcome {guestName}</h2>
        <div className="gd-checkin-btn">
          <p>We are waiting to onboard you. Enjoy your stay!</p>
          <button className="gd-checkin-button" onClick={onProceedCheckIn}>
            Proceed to Pre Check-In
          </button>
        </div>
        <p className="gd-account-name">Wieldy demo account</p>
      </div>
    </div>
  );
};

const Picks = () => {
  return (
    <div className="gd-picks">
      <h3>Top Picks for You</h3>
      <div className="gd-pick-options">
        <div className="gd-pick-option">
          <img src={luxuryImg} alt="Room Upgrades" />
          <div className="gd-overlay">
            <p>Room Upgrades</p>
          </div>
        </div>
        <div className="gd-pick-option">
          <img src={breakfastImg} alt="Order Breakfast" />
          <div className="gd-overlay">
            <p>Order Breakfast</p>
          </div>
        </div>
        <div className="gd-pick-option">
          <img src={bodySpaImg} alt="Body Spa" />
          <div className="gd-overlay">
            <p>Body Spa</p>
          </div>
        </div>
        <div className="gd-pick-option">
          <img src={cabImg} alt="Book a Cab" />
          <div className="gd-overlay">
            <p>Book a Cab</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// const BottomNavigation = ({ onHomeClick, onBookingDetails }) => {
//   return (
//     <div className="gd-bottom-navigation">
//       <button onClick={onHomeClick}>
//         <img src={home} alt="Home" />
//       </button>
//       <button onClick={onBookingDetails}>
//         <img src={checkIn} alt="Check In" />
//       </button>
//       <button>
//         <img src={key} alt="Key" />
//       </button>
//       <button>
//         <img src={help} alt="Help" />
//       </button>
//     </div>
//   );
// };

<BottomNavigation />;

export default GuestDashboard;
