import React, { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import "../styles/PreCheckInForm.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadPreCheckInData } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PreCheckin = () => {
  const [legalName, setLegalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState("");
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showDateOfBirthCalendar, setShowDateOfBirthCalendar] = useState(false);
  const [showArrivalTimeCalendar, setShowArrivalTimeCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const validateForm = () => {
    const newErrors = {};
    if (!legalName.trim()) newErrors.legalName = "Legal name is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!estimatedArrivalTime)
      newErrors.estimatedArrivalTime = "Estimated arrival time is required";
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
    formData.append("dateOfBirth", dateOfBirth.toISOString().split("T")[0]);
    formData.append("estimatedArrivalTime", estimatedArrivalTime.toISOString());
    try {
      // eslint-disable-next-line
      const response = await uploadPreCheckInData(formData);
      // console.log("Pre-check-in successful", response);
      navigate("/pre-check-in-success");
    } catch (error) {
      console.error("Pre-check-in failed:", error);
    }
  };

  const handleDateOfBirthChange = (date) => {
    setDateOfBirth(date);
    setShowDateOfBirthCalendar(false);
  };

  const handleArrivalTimeChange = (date) => {
    setEstimatedArrivalTime(date);
    setShowArrivalTimeCalendar(false);
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
        <h2 className="pre-checkin__subtitle">Verify your details</h2>

        <form onSubmit={handleSubmit}>
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
                onClick={() => setShowDateOfBirthCalendar(true)}
                readOnly
                className="pre-checkin__form-input"
              />
              <Calendar
                size={24}
                className="pre-checkin__calendar-icon"
                onClick={() => setShowDateOfBirthCalendar(true)}
              />
            </div>
            {showDateOfBirthCalendar && (
              <DatePicker
                selected={dateOfBirth}
                onChange={handleDateOfBirthChange}
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

          <div className="pre-checkin__form-group">
            <div className="pre-checkin__date-input-container">
              <input
                type="text"
                placeholder="Estimated arrival time"
                value={
                  estimatedArrivalTime
                    ? estimatedArrivalTime.toLocaleString()
                    : ""
                }
                onClick={() => setShowArrivalTimeCalendar(true)}
                readOnly
                className="pre-checkin__form-input"
              />
              <Calendar
                size={24}
                className="pre-checkin__calendar-icon"
                onClick={() => setShowArrivalTimeCalendar(true)}
              />
            </div>
            {showArrivalTimeCalendar && (
              <DatePicker
                selected={estimatedArrivalTime}
                onChange={handleArrivalTimeChange}
                inline
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
              />
            )}
            {errors.estimatedArrivalTime && (
              <p className="pre-checkin__error-message">
                {errors.estimatedArrivalTime}
              </p>
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
            <Link
              to="/terms-and-conditions"
              className="pre-checkin__accept-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              I accept
            </Link>
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
