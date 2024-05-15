/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import { PageControlPanel } from "./PageControlPanel";
import { PageAmbilData } from "./PageAmbilData";
import PageClassifier from "./PageClassifier";

function App() {
  const [message, setMessage] = useState("");
  // form control

  useEffect(() => {
    axios
      .get("http://localhost:5000/api")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => console.error("Error:", error));
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

  const [currentPage, setCurrentPage] = useState("page1");

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

  const handleAmbilData = () => {
    setCurrentPage("page1");
  };

  const handleClassifier = () => {
    setCurrentPage("page2");
  };
  const handleControlPanel = () => {
    setCurrentPage("page3");
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
      <h1 className="two-button-wrapper text-center">{message}</h1>
      <div className="d-flex justify-content-center" style={gap}>
        <button onClick={handleConnect} type="button" class="btn btn-danger">
          Connect to Arduino
        </button>
        <button
          onClick={handleControlPanel}
          type="button"
          class="btn btn-primary"
        >
          Control Panel
        </button>
        <button onClick={handleAmbilData} type="button" class="btn btn-primary">
          Ambil Data
        </button>
        <button
          onClick={handleClassifier}
          type="button"
          class="btn btn-primary"
        >
          Classifier
        </button>
      </div>
      {renderPage()}
    </>
  );
}

export default App;
