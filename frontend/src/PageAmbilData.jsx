import { CameraCapture } from "./Camera";
import { useState, useRef, useEffect } from "react";
import rizz from "./assets/rizz.mp3";
import short_augh from "./assets/short-augh.mp3";
import fart from "./assets/fart.mp3";
import axios from "axios";

export const PageAmbilData = () => {
  const [nomor, setNomor] = useState("");
  const [kematangan, setKematangan] = useState("");
  const [take, setTake] = useState("");
  const [colorChange, setColorChanged] = useState(false);
  const [colorChange2, setColorChanged2] = useState(false);
  // Color for Ambil Data Aroma
  const [tombolAroma, setTombolAroma] = useState(false);

  // AMBIL DATA
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
    <div id="ambil-data" className="mt-3 d-flex justify-content-center gap-4">
      <CameraCapture durian={{ nomor, kematangan, take }} />
      <div>
        {/* <ControlPanel /> */}
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
  );
};
