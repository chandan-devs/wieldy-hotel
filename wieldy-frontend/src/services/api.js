import axios from "axios";

const API = axios.create({
  baseURL: "https://wieldyportal.co.uk",
  // baseURL: "http://localhost:8080",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await API.post("/guest/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getHotelReservations = async () => {
  try {
    const response = await API.get("/guest/user-Hotel-reservations");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch hotel reservations:", error);
    throw error;
  }
};

export const getHotelReservationById = async (reservationId) => {
  try {
    const response = await API.get(
      `/guest/user-Hotel-reservations/${reservationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel reservation by ID:", error);
    throw error;
  }
};

export const getUnlockingDetails = async (reservationId) => {
  try {
    const response = await API.get(
      `/guest/user-Hotel-reservations/${reservationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching unlocking details:", error);
    throw error;
  }
};

export const unlockDoor = async (token, room) => {
  try {
    const response = await API.post("/unlockDoor", { token, room });
    return response.data;
  } catch (error) {
    console.error("Error unlocking door:", error);
    throw error;
  }
};

export const getPasscode = async (reservationId, room) => {
  try {
    const response = await API.get("/guest/getPasscode", {
      params: { reservationId, room },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching passcode:", error);
    throw error;
  }
};

export const checkIn = async (payload) => {
  try {
    const response = await API.post("/cloudBeds/api/checkin", payload);
    return response.data;
  } catch (error) {
    console.error("Check-in error:", error);
    throw error;
  }
};

export const uploadPreCheckInData = async (formData) => {
  try {
    const response = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: localStorage.getItem("token"), // Assuming you store the token in localStorage
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload pre-check-in data:", error);
    throw error;
  }
};

export default API;
