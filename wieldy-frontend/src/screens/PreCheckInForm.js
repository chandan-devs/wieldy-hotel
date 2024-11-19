import React, { useState, useRef } from "react";
import { Camera, ArrowLeft, Calendar } from "lucide-react";
import "../styles/PreCheckInForm.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadPreCheckInData } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PreCheckin = () => {
  const [legalName, setLegalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [frontOfIdCard, setFrontOfIdCard] = useState(null);
  const [backOfIdCard, setBackOfIdCard] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleImageUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === "front") {
          setFrontOfIdCard(file);
          setFrontPreview(reader.result);
        } else {
          setBackOfIdCard(file);
          setBackPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!legalName.trim()) newErrors.legalName = "Legal name is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!frontOfIdCard)
      newErrors.frontOfIdCard = "Front of ID card is required";
    if (!isAcknowledged)
      newErrors.acknowledgment =
        "You must acknowledge the information is true and accurate";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("reservationId", reservationId);
    formData.append("legalName", legalName);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("frontOfIdCard", frontOfIdCard);
    if (backOfIdCard) {
      formData.append("backOfIdCard", backOfIdCard);
    }

    try {
      const response = await uploadPreCheckInData(formData);
      console.log("Pre-check-in successful", response);
      navigate("/pre-check-in-success");
    } catch (error) {
      console.error("Pre-check-in failed:", error);
    }
  };

  const handleDateChange = (date) => {
    setDateOfBirth(date);
    setShowCalendar(false);
  };

  return (
    <div className="pre-checkin__container">
      <div className="pre-checkin__header">
        <Link to="/dashboard">
          <button className="pre-checkin__back-button">
            <ArrowLeft size={24} />
          </button>
        </Link>
        <header className="pre-checkin__title">
          <h1>Pre Check-in</h1>
        </header>
      </div>

      <main className="pre-checkin__main-content">
        <h2 className="pre-checkin__subtitle">Verify your identity</h2>

        <form onSubmit={handleSubmit}>
          <div className="pre-checkin__id-upload-section">
            <div
              className="pre-checkin__upload-card"
              onClick={() => frontInputRef.current.click()}
            >
              {frontPreview ? (
                <img
                  src={frontPreview}
                  alt="Front of ID Card"
                  className="pre-checkin__preview-image"
                />
              ) : (
                <>
                  <Camera size={24} color="#4361ee" />
                  <p className="pre-checkin__upload-title">Front of ID Card</p>
                  <p className="pre-checkin__upload-subtitle">
                    (Need your Camera and Gallery Access)
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "front")}
                ref={frontInputRef}
                style={{ display: "none" }}
              />
              {errors.frontOfIdCard && (
                <p className="pre-checkin__error-message">
                  {errors.frontOfIdCard}
                </p>
              )}
            </div>

            <div
              className="pre-checkin__upload-card"
              onClick={() => backInputRef.current.click()}
            >
              {backPreview ? (
                <img
                  src={backPreview}
                  alt="Back of ID Card"
                  className="pre-checkin__preview-image"
                />
              ) : (
                <>
                  <Camera size={24} color="#4361ee" />
                  <p className="pre-checkin__upload-title">
                    Back of ID Card (Optional)
                  </p>
                  <p className="pre-checkin__upload-subtitle">
                    (Need your Camera and Gallery Access)
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "back")}
                ref={backInputRef}
                style={{ display: "none" }}
              />
            </div>
            {errors.backOfIdCard && (
              <p className="pre-checkin__error-message">
                {errors.backOfIdCard}
              </p>
            )}
          </div>

          <div className="pre-checkin__form-group">
            <input
              type="text"
              placeholder="Legal name"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="pre-checkin__form-input"
            />
            {errors.legalName && (
              <p className="pre-checkin__error-message">{errors.legalName}</p>
            )}
          </div>

          <div className="pre-checkin__form-group">
            <div className="pre-checkin__date-input-container">
              <input
                type="text"
                placeholder="Date of birth"
                value={dateOfBirth ? dateOfBirth.toLocaleDateString() : ""}
                onClick={() => setShowCalendar(true)}
                readOnly
                className="pre-checkin__form-input"
              />
              <Calendar
                size={24}
                className="pre-checkin__calendar-icon"
                onClick={() => setShowCalendar(true)}
              />
            </div>
            {showCalendar && (
              <DatePicker
                selected={dateOfBirth}
                onChange={handleDateChange}
                inline
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
              />
            )}
            {errors.dateOfBirth && (
              <p className="pre-checkin__error-message">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="pre-checkin__acknowledgment">
            <label className="pre-checkin__checkbox-container">
              <input
                type="checkbox"
                checked={isAcknowledged}
                onChange={(e) => setIsAcknowledged(e.target.checked)}
              />
              <span className="pre-checkin__checkbox-text">
                By checking this box, I acknowledge and certify that the above
                information is true and accurate.
              </span>
            </label>
            <a href="#" className="pre-checkin__accept-link">
              I accept
            </a>
            {errors.acknowledgment && (
              <p className="pre-checkin__error-message">
                {errors.acknowledgment}
              </p>
            )}
          </div>
          <button type="submit" className="pre-checkin__submit-button">
            Complete Pre Check-in
          </button>
        </form>
      </main>
    </div>
  );
};

export default PreCheckin;
