import React from "react";
import "./Preload.css";

const Preload = ({ isLoaded }) => {
  return (
    <div className={`preload ${isLoaded ? "fade-out" : ""}`}>
    </div>
  );
};

export default Preload;
