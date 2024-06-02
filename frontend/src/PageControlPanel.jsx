import { useState, useRef, useEffect } from "react";
export const PageControlPanel = () => {
  const videoRef = useRef(null);
  const [colorChange, setColorChanged] = useState(false);
  const [colorChange2, setColorChanged2] = useState(false);
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
  const handleButton1Click = () => {
    kirimPerintahKeServer("1");
    setColorChanged(!colorChange);
  };
  const handleButton2Click = () => {
    kirimPerintahKeServer("2");
    setColorChanged2(!colorChange2);
  };
  return (
    <>
      <div className="mt-3 d-flex justify-content-center">
        <video ref={videoRef} autoPlay muted style={{ width: "480px" }} />
      </div>
      <div className="mt-3 mb-5 d-flex justify-content-center flex-wrap gap-5">
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
        <div className="mt-3 d-flex gap-3">
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
        </div>
      </div>
    </>
  );
};
