import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GuestLogin from "./screens/GuestLogin";
import GuestDashboard from "./screens/GuestDashboard";
import PreCheckInForm from "./screens/PreCheckInForm";
import PreCheckInSuccess from "./screens/PreCheckInSuccess";
import BookingDetails from "./screens/BookingDetails";
import UnlockingDetails from "./screens/UnlockingDetails";
import UnlockRoom from "./screens/UnlockRoom";
import UnlockSuccess from "./screens/UnlockSuccess";
import UnlockFailed from "./screens/UnlockFailed";
import UnlockFailedHelpSupport from "./screens/UnlockFailedHelpSupport";
import HelpSupport from "./screens/Help&Support";
import "./index.css";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen size is for mobile devices
    const checkIfMobile = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="mobile-only-message">
        This application is only available on mobile devices.
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestLogin />} />
        <Route path="/dashboard" element={<GuestDashboard />} />
        <Route
          path="/pre-check-in/:reservationId"
          element={<PreCheckInForm />}
        />
        <Route path="/pre-check-in-success" element={<PreCheckInSuccess />} />
        <Route
          path="/bookingdetails/:reservationId"
          element={<BookingDetails />}
        />
        <Route
          path="/unlocking-details/:reservationId"
          element={<UnlockingDetails />}
        />
        <Route
          path="/unlock-room/:reservationId/:roomName"
          element={<UnlockRoom />}
        />
        <Route path="/unlock-success/:roomName" element={<UnlockSuccess />} />
        <Route
          path="/unlock-failed/:reservationId/:roomName"
          element={<UnlockFailed />}
        />
        <Route
          path="/unlock-failed-help-support/:reservationId/:roomName"
          element={<UnlockFailedHelpSupport />}
        />
        <Route path="/help-support" element={<HelpSupport />} />
      </Routes>
    </Router>
  );
}

export default App;
