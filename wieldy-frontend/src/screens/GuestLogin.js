import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GuestLogin.css";
import doorLock from "../assets/doorLock.png";
import { login } from "../services/api";

const GuestLogin = () => {
  // const [contactInfo, setContactInfo] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const mpin = otp.join("");
      const credentials = {
        // email: contactInfo,
        identifier: identifier,
        password: mpin,
      };
      const response = await login(credentials);
      console.log("Login successful", response);
      // localStorage.setItem("userInfo", JSON.stringify(response));
      localStorage.setItem("token", response.token);
      localStorage.setItem("responseData", JSON.stringify(response)); // Save the entire response
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
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
    <div>
      <div className="login-container">
        <div className="image-card">
          <img src={doorLock} alt="Hotel Lock" />
          <div className="image-overlay">
            <div className="text-content">
              <h1>Experience</h1>
              <h2>the best hotel stays</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              // placeholder="email address"
              placeholder="Mobile number or email"
              // value={contactInfo}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <span className="material-icons icon">person</span>
          </div>

          <div className="verify-container">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={inputRefs[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            <button className="verify-button" type="submit">
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestLogin;
