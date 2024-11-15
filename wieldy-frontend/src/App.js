import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GuestLogin from "./screens/GuestLogin";
import GuestDashboard from "./screens/GuestDashboard";
import PreCheckInForm from "./screens/PreCheckInForm";
import BookingDetails from "./screens/BookingDetails";
import UnlockingDetails from "./screens/UnlockingDetails";
import UnlockRoom from "./screens/UnlockRoom";
import UnlockSuccess from "./screens/UnlockSuccess";
import UnlockFailed from "./screens/UnlockFailed";
import HelpSupport from "./screens/Help&Support";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestLogin />} />
        <Route path="/dashboard" element={<GuestDashboard />} />
        {/* <Route path="/pre-check-in/:reservationId" element={<PreCheckInForm />} /> */}
        <Route path="/pre-check-in" element={<PreCheckInForm />} />
        <Route
          path="/bookingdetails/:reservationId"
          element={<BookingDetails />}
        />
        <Route
          path="/unlocking-details/:reservationId"
          element={<UnlockingDetails />}
        />
        <Route
          path="/unlock-room/:reservationId/:roomId"
          element={<UnlockRoom />}
        />
        {/* <Route path="/unlock-success" element={<UnlockSuccess />} /> */}
        <Route path="/unlock-success/:roomId" element={<UnlockSuccess />} />
        {/* <Route path="/unlock-failed" element={<UnlockFailed />} /> */}
        <Route
          path="/unlock-failed/:reservationId/:roomId"
          element={<UnlockFailed />}
        />
        <Route path="/help-and-support" element={<HelpSupport />} />
      </Routes>
    </Router>
  );
}

export default App;
