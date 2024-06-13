/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Preload from "./Preload";

import { PageControlPanel } from "./PageControlPanel";
import { PageAmbilData } from "./PageAmbilData";
import PageClassifier from "./PageClassifier";

function App() {
  const [message, setMessage] = useState("Not Connected");
  const [activeButton, setActiveButton] = useState("ambilData");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("page1");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => console.error("Error:", error));
    //Preloader screen timer
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const kirimPerintahKeServer = async (perintah) => {
    try {
      const response = await fetch("http://localhost:5000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ perintah }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim perintah");
      }

      const data = await response.json();
      console.log("Respon dari server:", data);
      setStatus(data.status); // Mengatur status dari respon
    } catch (error) {
      console.error("Kesalahan:", error);
    }
  };

  let gap = { gap: "20px" };

  const handleConnect = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/connect-to-arduino"
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const HandleActiveButton = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleAmbilData = () => {
    setCurrentPage("page1");
    HandleActiveButton("ambilData");
  };

  const handleClassifier = () => {
    setCurrentPage("page2");
    HandleActiveButton("classifier");
  };
  const handleControlPanel = () => {
    setCurrentPage("page3");
    HandleActiveButton("controlPanel");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "page1":
        return <PageAmbilData />;
      case "page2":
        return <PageClassifier />;
      case "page3":
        return <PageControlPanel />;
      default:
        return <PageAmbilData />;
    }
  };

  return (
    <>
      <Preload isLoaded={!loading} />
      {!loading && (
        <div>
          <h1 className="two-button-wrapper text-center">
            Durian Classifier HMI
          </h1>
          <p className="text-center">Server Status : {message}</p>
          <div className="d-flex justify-content-center" style={gap}>
            <button
              onClick={handleConnect}
              type="button"
              class="btn btn-danger"
            >
              Connect to Arduino
            </button>
            <button
              onClick={handleControlPanel}
              type="button"
              class={
                activeButton === "controlPanel"
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
            >
              Control Panel
            </button>
            <button
              onClick={handleAmbilData}
              type="button"
              class={
                activeButton === "ambilData"
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
            >
              Ambil Data
            </button>
            <button
              onClick={handleClassifier}
              type="button"
              class={
                activeButton === "classifier"
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
            >
              Classifier
            </button>
          </div>
          {renderPage()}
        </div>
      )}
    </>
  );
}

export default App;
