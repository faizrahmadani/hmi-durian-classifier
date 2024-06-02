import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
function PageClassifier() {
  const [gasPrediction, setGasPrediction] = useState("None");
  const [imagePrediction, setImagePrediction] = useState("None");
  const [webcamPrediction, setWebcamPrediction] = useState("None");
  useEffect(() => {}, []);

  const loadGas = async () => {
    try {
      const response = await axios.post("http://localhost:5000/load-cnn-gas");
      console.log(response);
      setGasPrediction(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const FileUpload = ({ prediction, predictionText, info, load }) => {
    const [fileName, setFileName] = useState(info);

    const handleFileChange = (event) => {
      setFileName(event.target.files[0].name);
    };

    return (
      <div className="col-md-4 text-center">
        <label className="file-upload">
          <input type="file" onChange={handleFileChange} />
          <span className="text-muted">{fileName}</span>
        </label>
        <div className={`prediction`}>
          Predicted :{" "}
          <span className={`prediction ${prediction}`}>{predictionText}</span>
        </div>
        <button className="btn btn-primary mt-2 mb-2" onClick={load}>
          Classify
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="mt-4 d-flex justify-content-center  gap-3">
        <div className="container mt-5">
          <div className="row">
            <FileUpload
              prediction={
                gasPrediction === "ripe"
                  ? "text-success"
                  : gasPrediction === "unripe"
                  ? "text-danger"
                  : ""
              }
              predictionText={gasPrediction}
              info="CNN GAS"
              load={loadGas}
            />
            <FileUpload
              prediction={
                imagePrediction === "ripe"
                  ? "text-success"
                  : imagePrediction === "unripe"
                  ? "text-danger"
                  : ""
              }
              predictionText={imagePrediction}
              info="CNN IMAGE"
            />
            <FileUpload
              prediction={
                webcamPrediction === "ripe"
                  ? "text-success"
                  : webcamPrediction === "unripe"
                  ? "text-danger"
                  : ""
              }
              predictionText={webcamPrediction}
              info="CNN WEBCAM IMAGE"
            />
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default PageClassifier;
