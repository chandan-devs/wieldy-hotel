// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../styles/UnlockRoom.css";
// import lockIcon from "../assets/unlockSucess.png";
// import home from "../assets/navIcons/Home.png";
// import checkIn from "../assets/navIcons/checkIn.png";
// import key from "../assets/navIcons/key.png";
// import help from "../assets/navIcons/help.png";

// const UnlockRoom = () => {
//   const [isUnlocked, setIsUnlocked] = useState(false);
//   const navigate = useNavigate();
//   const { roomId } = useParams();

//   const handleUnlock = () => {
//     setIsUnlocked(true);
//     // Add your unlocking logic here
//   };

//   return (
//     <>
//       <div className="header">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           ←
//         </button>
//         <h1>Unlock Success</h1>
//       </div>
//       <div className="room-number">
//         <span>Room Number: {roomId}</span>
//       </div>
//       <div className="unlock-room-container">
//         <div className="lock-icon">
//           <img src={lockIcon} alt="Lock" />
//         </div>

//         <button
//           className={`unlock-button ${isUnlocked ? "unlocked" : ""}`}
//           onClick={handleUnlock}
//           disabled={isUnlocked}
//         >
//           {/* {isUnlocked ? "Room Unlocked" : "Click here to Unlock Now"} */}
//           Room has been unlocked Successfully
//         </button>

//         <div className="bottom-navigation">
//           <button onClick={() => navigate("/dashboard")}>
//             <img src={home} alt="Home" />
//           </button>
//           <button onClick={() => navigate(`/bookingdetails/${roomId}`)}>
//             <img src={checkIn} alt="Check In" />
//           </button>
//           <button>
//             <img src={key} alt="Key" />
//           </button>
//           <button>
//             <img src={help} alt="Help" />
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UnlockRoom;

// -----------------------------------------------

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UnlockRoom.css";
import lockIcon from "../assets/unlockSucess.png";
import home from "../assets/navIcons/Home.png";
import checkIn from "../assets/navIcons/checkIn.png";
import key from "../assets/navIcons/key.png";
import help from "../assets/navIcons/help.png";

const UnlockSuccess = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  return (
    <>
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Unlock Success</h1>
      </div>
      <div className="room-number">
        <span>Room Number: {roomId}</span>
      </div>
      <div className="unlock-room-container">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock" />
        </div>

        <button className="unlock-button unlocked" disabled>
          Room {roomId} has been unlocked Successfully
        </button>

        <div className="bottom-navigation">
          <button onClick={() => navigate("/dashboard")}>
            <img src={home} alt="Home" />
          </button>
          <button onClick={() => navigate(`/bookingdetails/${roomId}`)}>
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
    </>
  );
};

export default UnlockSuccess;
