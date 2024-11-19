import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Help&Support.css";
import BottomNavigation from "../components/BottomNavigation";

const HelpSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="helpContainer">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>Help & Support</h1>
      </div>
      <div className="email-support">
        <span>Mail to: support@wieldyportal.co.uk</span>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HelpSupport;
