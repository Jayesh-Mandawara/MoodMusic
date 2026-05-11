import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

const FaceExpression = () => {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [isReady, setIsReady] = useState(false);
    const [expression, setExpression] = useState("Ready to feel the vibe?");

    useEffect(() => {
        if (!landmarkerRef.current) {
            init({
                videoRef,
                landmarkerRef,
                setIsReady,
                setExpression,
                streamRef,
            });
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
        <div className="app-container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '2rem',
            gap: '2rem',
            flex: 1
        }}>
            <header style={{ textAlign: 'center', maxWidth: '600px' }}>
                <h1>Mood<span className="text-gradient">Music</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Let our AI scan your emotions and curate the perfect soundtrack for your soul.
                </p>
            </header>

            <main className="glass-card" style={{ 
                padding: '1.5rem', 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <div style={{ 
                    position: 'relative', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 0 40px var(--primary-glow)',
                    border: '1px solid var(--glass-border)'
                }}>
                    <video
                        ref={videoRef}
                        style={{ 
                            width: "100%", 
                            maxWidth: "500px", 
                            display: 'block',
                            aspectRatio: '4/3',
                            objectFit: 'cover'
                        }}
                        autoPlay
                        muted
                        playsInline
                    />
                    {!isReady && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 10
                        }}>
                            <div className="loader">Initializing AI...</div>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ 
                        textTransform: 'uppercase', 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.1em', 
                        color: 'var(--text-secondary)',
                        marginBottom: '0.5rem'
                    }}>
                        Current Mood
                    </p>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>
                        {expression}
                    </h2>
                </div>

                <button
                    className="btn-primary"
                    onClick={() => {
                        detect({ videoRef, landmarkerRef, setExpression, isReady });
                    }}
                    disabled={!isReady}
                >
                    {isReady ? (
                        <>
                            <span>Scan My Face</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </>
                    ) : "Preparing Vision..."}
                </button>
            </main>

            <footer style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                AI-Powered Emotion Recognition & Music Curation
            </footer>

            <style>{`
                .loader {
                    color: white;
                    font-weight: 600;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default FaceExpression;
