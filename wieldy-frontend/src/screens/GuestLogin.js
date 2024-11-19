import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import doorLock from "../assets/doorLock.svg";
import "../styles/GuestLogin.css";

const GuestLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    try {
      const mpin = otp.join("");
      const credentials = {
        identifier: identifier,
        password: mpin,
      };
      const response = await login(credentials);
      localStorage.setItem("token", response.token);
      localStorage.setItem("responseData", JSON.stringify(response));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="guest-login-container">
      <div className="guest-image-card">
        <img src={doorLock} alt="Hotel Lock" />
        <div className="guest-image-overlay">
          <div className="guest-text-content">
            <p>Experience</p>
            <p>the best hotel stays</p>
          </div>
        </div>
      </div>
      <div className="guest-form-section">
        <form onSubmit={handleSubmit}>
          <div className="guest-input-group">
            <input
              type="text"
              placeholder="Enter Your Number with Country Code"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <span className="material-icons guest-icon">phone_android</span>
          </div>

          <div className="guest-verify-container">
            <div className="guest-otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="number"
                  min="0"
                  max="9"
                  maxLength={1}
                  value={digit}
                  ref={inputRefs[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 1);
                  }}
                />
              ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="guest-verify-button" type="submit">
              LOGIN NOW
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestLogin;
