/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { CameraCapture } from "./Camera";
import rizz from "./assets/rizz.mp3";
import short_augh from "./assets/short-augh.mp3";
import fart from "./assets/fart.mp3";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [colorChange, setColorChanged] = useState(false);
  const [colorChange2, setColorChanged2] = useState(false);
  // form control
  const [nomor, setNomor] = useState("");
  const [kematangan, setKematangan] = useState("");
  const [take, setTake] = useState("");

  // Color for Ambil Data Aroma
  const [tombolAroma, setTombolAroma] = useState(false);

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

  const ambilDataAroma = async () => {
    if (!nomor && !kematangan && !take) {
      let stop = new Audio(fart);
      stop.play();
      alert("masukan nomor, kematangan, dan percobaan keberapa dulu...");
    } else {
      let audio_rizz = new Audio(rizz);
      let shortAugh = new Audio(short_augh);
      audio_rizz.play();
      setTombolAroma(true);
      setTimeout(() => {
        setTombolAroma(false);
        shortAugh.play();
      }, 30000);
      const dataToSend = {
        nomor: nomor,
        kematangan: kematangan,
        take: take,
      };
      // kirimPerintahKeServer("3");
      try {
        const response = await axios.post(
          "http://localhost:5000/gas-aroma-record",
          dataToSend
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleButton1Click = () => {
    kirimPerintahKeServer("1");
    setColorChanged(!colorChange);
  };
  const handleButton2Click = () => {
    kirimPerintahKeServer("2");
    setColorChanged2(!colorChange2);
  };

  const handleNomor = (e) => {
    setNomor(e.target.value);
  };
  const handleKematangan = (e) => {
    setKematangan(e.target.value);
  };
  const handleTake = (e) => {
    setTake(e.target.value);
  };

  return (
    <>
      <h1 className="two-button-wrapper text-center">{message}</h1>
      <div className="mt-5 d-flex justify-content-center  gap-4">
        <CameraCapture durian={{ nomor, kematangan, take }} />
        <div>
          <div className="mt-3 d-flex gap-3">
            <h3>Lamp Control</h3>
            <button
              onClick={handleButton1Click}
              type="button"
              className={
                colorChange ? "btn btn-danger px-3" : "btn btn-success px-3"
              }
            >
              {colorChange ? "Off" : "On"}
            </button>
          </div>
          {/* <div className="mt-3 d-flex gap-3">
            <h3>Fan Control</h3>
            <button
              onClick={handleButton2Click}
              type="button"
              className={
                colorChange2 ? "btn btn-danger px-3" : "btn btn-success px-3"
              }
            >
              {colorChange2 ? "Off" : "On"}
            </button>
          </div> */}
          <div className="mt-3 d-flex gap-3">
            <h3>Ambil Data Aroma</h3>
            <button
              onClick={ambilDataAroma}
              type="button"
              className={
                tombolAroma ? "btn btn-danger px-3" : "btn btn-success px-3"
              }
            >
              {tombolAroma ? "Mengambil..." : "Ambil"}
            </button>
          </div>
          <div className="mt-2">
            <label>Nomor Durian</label>
            <input
              class="form-control"
              type="number"
              value={nomor}
              onChange={handleNomor}
              placeholder="1,2,3,dst..."
            />
          </div>
          <div className="mt-2">
            <label>Tingkat Kematangan Buah Durian</label>
            <select
              class="form-select"
              onChange={handleKematangan}
              aria-label="Default select example"
            >
              <option value="">Open this select menu</option>
              <option value="matang">matang</option>
              <option value="mentah">mentah</option>
            </select>
          </div>
          <div className="mt-2">
            <label>Pengambilan ke-</label>
            <select
              class="form-select"
              onChange={handleTake}
              aria-label="Default select example"
            >
              <option value="">Open this select menu</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
