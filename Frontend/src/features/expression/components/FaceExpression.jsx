import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

const FaceExpression = () => {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [isReady, setIsReady] = useState(false);
    const [expression, setExpression] = useState("Press button to detect...");

    useEffect(() => {

        if (!landmarkerRef.current) {
            init({ videoRef, landmarkerRef, setIsReady, setExpression, streamRef });
        }

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
                landmarkerRef.current = null;
            }
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                autoPlay
                muted
                playsInline
            />
            <h2>{expression}</h2>
            <button
                onClick={() => {
                    detect({ videoRef, landmarkerRef, setExpression, isReady });
                }}
                disabled={!isReady}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: isReady ? "pointer" : "not-allowed",
                    backgroundColor: isReady ? "#4CAF50" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                }}
            >
                {isReady ? "Detect Expression" : "Loading AI..."}
            </button>
        </div>
    );
};

export default FaceExpression;
