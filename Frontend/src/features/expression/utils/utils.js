import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({ videoRef, landmarkerRef, setIsReady, setExpression, streamRef }) => {
    try {
        // Request camera permission *before* downloading large models
        streamRef.current = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        if (videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current
                    .play()
                    .catch((e) => console.warn("video play aborted:", e));
            };
        }

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
        });

        setIsReady(true);
    } catch (error) {
        console.error("Error initializing:", error);
        setExpression("Error: " + error.message);
    }
};

export const detect = ({ videoRef, landmarkerRef, setExpression, isReady }) => {
    if (!isReady || !videoRef.current || !landmarkerRef.current) {
        setExpression("Still initializing, please wait...");
        return;
    }

    if (videoRef.current.readyState >= 2) {
        try {
            let startTimeMs = performance.now();
            const results = landmarkerRef.current.detectForVideo(
                videoRef.current,
                startTimeMs,
            );

            if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
                const blendshapes = results.faceBlendshapes[0].categories;

                const getScore = (name) => {
                    return (
                        blendshapes.find((b) => b.categoryName === name)
                            ?.score || 0
                    );
                };

                // Average out symmetrical features
                const smile =
                    (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) /
                    2;
                const frown =
                    (getScore("mouthFrownLeft") + getScore("mouthFrownRight")) /
                    2;
                const jawOpen = getScore("jawOpen");
                const browInnerUp = getScore("browInnerUp");
                const browDown =
                    (getScore("browDownLeft") + getScore("browDownRight")) / 2;
                const pout = getScore("mouthPucker");
                const lipShrug = getScore("mouthShrugLower");

                let currentExpression = "Neutral";

                // Logging the exact values to the browser console to see what your face actually triggers!
                console.log(
                    "Sad metrics - Frown:",
                    frown.toFixed(5),
                    " | Pout:",
                    pout.toFixed(5),
                    " | LipShrug:",
                    lipShrug.toFixed(5),
                );

                if (smile > 0.4) {
                    currentExpression = "Happy 😁";
                } else if (jawOpen > 0.3 && browInnerUp > 0.2) {
                    currentExpression = "Surprised 😮";
                } else if (frown > 0.1 || pout > 0.25 || lipShrug > 0.25) {
                    // Increased the thresholds so your natural neutral face won't trigger it!
                    currentExpression = "Sad 😞";
                } else if (browInnerUp > 0.7) {
                    currentExpression = "Angry 😠";
                }

                setExpression(currentExpression);
            } else {
                setExpression("No face directly visible. Try again!");
            }
        } catch (e) {
            console.error("Detect loop error:", e);
            setExpression("Detection failed. Please try again.");
        }
    } else {
        setExpression("Camera frame not ready yet.");
    }
};
