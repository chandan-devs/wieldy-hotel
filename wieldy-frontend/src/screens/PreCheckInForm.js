import React, { useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import "../styles/PreCheckInForm.css";
import { Link } from "react-router-dom";

const PreCheckin = () => {
  const [legalName, setLegalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  // const [isAcknowledged, setIsAcknowledged] = useState(false);

  return (
    <div className="pre-checkin-container">
      <div className="precheckinHeader">
        <Link to="/dashboard">
          <button className="back-button">
            <ArrowLeft size={24} />
          </button>
        </Link>
        <header className="header">
          <h1>Pre Check-in</h1>
        </header>
      </div>

      <main className="main-content">
        <h2>Verify your identity</h2>

        <div className="id-upload-section">
          <div className="upload-card">
            <Camera size={24} color="#4361ee" />
            <p className="upload-title">Front of ID Card</p>
            <p className="upload-subtitle">
              (Need your Camera and Gallery Access)
            </p>
          </div>

          <div className="upload-card">
            <Camera size={24} color="#4361ee" />
            <p className="upload-title">Back of ID Card</p>
            <p className="upload-subtitle">
              (Need your Camera and Gallery Access)
            </p>
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Legal name"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Date of birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="acknowledgment">
          <label className="checkbox-container">
            <input
              type="checkbox"
              // checked={isAcknowledged}
              // onChange={(e) => setIsAcknowledged(e.target.checked)}
            />
            <span className="checkbox-text">
              By checking this box, I acknowledge and certify that the above
              information is true and accurate.
            </span>
          </label>
          <a href="#" className="accept-link">
            I accept
          </a>
        </div>
        <Link to="/precheckinsuccess">
          {/* disabled={!isAcknowledged} */}
          <button className="submit-button">Complete Pre Check-in</button>
        </Link>
      </main>
    </div>
  );
};

export default PreCheckin;
