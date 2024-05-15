import { useRef, useState, useEffect } from "react";
import fart from "./assets/fart.mp3";
import camera_click from "./assets/camera-click.mp3";
import axios from "axios";

export const CameraCapture = ({ durian }) => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    // Clean up function to stop the camera when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
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

  //Kode untuk menyimpan gambar seperti mendownload gambar di browser
  const saveImageLocally = (dataUrl) => {
    if (durian.nomor == "" && durian.kematangan == "" && durian.take == "") {
      let stop = new Audio(fart);
      stop.play();
      alert("masukan nomor, kematangan, dan percobaan keberapa dulu...");
    } else {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${durian.nomor} ${durian.kematangan} ${durian.take}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  //Kode untuk menyimpan gambar dibagian backend
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

  return (
    <div>
      {/* {capturedImage && <img src={capturedImage} alt="Captured" />} */}
      {/* <br /> */}
      <video ref={videoRef} autoPlay muted style={{ width: "640px" }}></video>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={captureImage}>
          <i class="fa-solid fa-camera"></i> Capture Image
        </button>
      </div>
    </div>
  );
};
