import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "84px",
            height: "102px",
            position: "relative",
            margin: "0 auto 20px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "56px",
              backgroundColor: "#3068FD",
              borderRadius: "7px",
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          ></div>
          <div
            style={{
              width: "42px",
              height: "46px",
              border: "11px solid #3068FD",
              borderBottom: "none",
              borderRadius: "42px 42px 0 0",
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              animation: "unlock 2s infinite",
            }}
          ></div>
          <div
            style={{
              width: "17px",
              height: "22px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              position: "absolute",
              bottom: "17px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          ></div>
        </div>
        <div style={{ fontSize: "16px", color: "#3068FD" }}>
          Unlocking in Progress...
        </div>
      </div>
      <style>{`
        @keyframes unlock {
          0%, 20% { transform: translateX(-50%) rotate(0); }
          60%, 100% { transform: translateX(-20%) rotate(-10deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
