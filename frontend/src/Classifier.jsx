import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
function Classifier() {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [nomor, setNomor] = useState("");
  const [kematangan, setKematangan] = useState("");
  const [take, setTake] = useState("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    // Clean up function to stop the camera when the component unmounts
    return () => {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);
  // Function to capture an image
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    // saveImageLocally(imageData);
    sendDataToBackend(imageData);
  };

  const sendDataToBackend = (imageData) => {
    if (durian.nomor == "" && durian.kematangan == "" && durian.take == "") {
      let stop = new Audio(fart);
      stop.play();
      alert("masukan nomor, kematangan, dan percobaan keberapa dulu...");
    } else {
      axios
        .post("http://localhost:5000/upload-image", {
          image: imageData,
          nomor: durian.nomor,
          kematangan: durian.kematangan,
          take: durian.take,
        })
        .then((response) => {
          // Handle response from backend
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error sending data to backend:", error);
        });
      let audio = new Audio(camera_click);
      audio.play();
    }
  };
  let buttonStyle = {
    fontSize: "16px",
  };

  const cnnGasModel = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cnn-gas-model");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="mt-4 d-flex justify-content-center  gap-3">
        <div>
          <video ref={videoRef} autoPlay muted style={{ width: "640px" }} />
          <div className="d-flex justify-content-center">
            <button className="btn btn-success" onClick={captureImage}>
              <i class="fa-solid fa-camera"></i> Capture Image
            </button>
          </div>
        </div>
        <div>
          <div className="d-flex gap-2 align-items-center" style={buttonStyle}>
            <h4>Ambil Data Aroma</h4>
            <button
              onClick={cnnGasModel}
              type="button"
              className="btn btn-primary"
            >
              Ambil
            </button>
          </div>
          <div className="mt-3">
            <h4>CNN Gas Output : </h4>
            <h4>CNN Image Output : </h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default Classifier;
