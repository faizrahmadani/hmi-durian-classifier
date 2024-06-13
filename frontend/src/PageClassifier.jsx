import { useState } from "react";
import "./App.css";
import axios from "axios";

function PageClassifier() {
  // Predictions Output
  const [gasPrediction, setGasPrediction] = useState("None");
  const [webcamPrediction, setWebcamPrediction] = useState("None");
  //End of Predictions Output

  // Prediction Files
  const [gasFile, setGasFile] = useState(null);
  const [gasFileName, setGasFileName] = useState("CNN GAS");
  const [webcamFile, setWebcamFile] = useState(null);
  const [webcamFileName, setWebcamFileName] = useState("CNN IMAGE");
  //End of Prediction Files

  //Functions which work for the Gas Files
  const loadGas = async (event) => {
    event.preventDefault(); // Prevent the default action
    const formData = new FormData();
    formData.append("file", gasFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/load-cnn-gas",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setGasPrediction(response.data);
      alert(`Predicted : ${response.data}`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGasFile = (event) => {
    setGasFile(event.target.files[0]);
    setGasFileName(event.target.files[0].name);
    console.log(gasFileName);
  };
  // End of Functions which work for the Gas Files

  //Functions which work for the Webcam Files
  const loadWebcam = async (event) => {
    event.preventDefault(); // Prevent the default action
    const formData = new FormData();
    formData.append("file", webcamFile);
    try {
      const response = await axios.post(
        "http://localhost:5000/load-cnn-webcam",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setWebcamPrediction(response.data);
      alert(`Predicted : ${response.data}`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleWebcamFile = (event) => {
    setWebcamFile(event.target.files[0]);
    setWebcamFileName(event.target.files[0].name);
    console.log(webcamFileName);
  };
  //End of Functions which work for the Webcam Files

  const FileUpload = ({
    prediction,
    predictionText,
    filename,
    submit,
    handle,
  }) => {
    return (
      <div className="col-md-4 text-center">
        <form onSubmit={submit}>
          <label className="file-upload">
            <input type="file" onChange={handle} />
            <span className="text-muted">{filename}</span>
          </label>
          <div className={`prediction`}>
            Predicted :{" "}
            <span className={`prediction ${prediction}`}>{predictionText}</span>
          </div>
          <button type="submit" className="btn btn-primary mt-2 mb-2">
            Classify
          </button>
        </form>
      </div>
    );
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center flex-wrap gap-3">
        <FileUpload
          prediction={
            gasPrediction === "ripe"
              ? "text-success"
              : gasPrediction === "unripe"
              ? "text-danger"
              : ""
          }
          predictionText={gasPrediction}
          submit={loadGas}
          filename={gasFileName}
          handle={handleGasFile}
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
          submit={loadWebcam}
          filename={webcamFileName}
          handle={handleWebcamFile}
        />
      </div>
    </>
  );
}

export default PageClassifier;
