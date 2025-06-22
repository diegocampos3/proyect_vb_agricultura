import React, { useEffect, useState } from "react";
import { useCropContext } from "../../context/CropContext";
import clienteAxios from "../../config/axios";
import './styles.css';  

function Precipitation() {
  const { cropData } = useCropContext();
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchRecommendations = async () => {
          setLoading(true);
          setError(null);
          try {
              const response = await clienteAxios.post("/generate-content", {
                  crop: cropData.crop,
                  cultivationA: cropData.cultivationA,
                  agriculturalP: cropData.agriculturalP,
                  lat: parseFloat(cropData.lat),
                  lng: parseFloat(cropData.lng),
                  predictionYear: cropData.predictionYear,
                  predictionMonth: cropData.predictionMonth,
                  context: "Precipitation",
              });

              if (response.status !== 200) {
                  throw new Error("Error obtaining recommendations");
              }

              setRecommendations(response.data.content);
          } catch (error) {
              console.error("Error:", error);
              setError("Por favor recuerda que primero debes registrar un cultivo");
          } finally {
              setLoading(false);
          }
      };

      if (cropData) {
          fetchRecommendations();
      }

  }, [cropData]);

  const handleSpeak = () => {
      if (recommendations) {
          const speech = new SpeechSynthesisUtterance(recommendations);
          speechSynthesis.speak(speech);
      }
  };

  const handleStop = () => {
      speechSynthesis.cancel(); 
  };

  return (
      <div>
          <h1>Precipitation</h1>
          <pre>{JSON.stringify(cropData, null, 2)}</pre>

          {loading && <p>Loading recommendations...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {recommendations && (
              <div className="result-container"> 
                  <h2>Recommendations:</h2>
                  <pre>{recommendations}</pre>
              </div>
          )}
          
          <div className="btn-container">
              <button className="custom-btn" onClick={handleSpeak}>Read Aloud</button>
              <button className="custom-btn" onClick={handleStop}>Stop</button>
          </div>
      </div>
  );
}

export default Precipitation;
