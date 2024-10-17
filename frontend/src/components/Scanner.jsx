import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

function Scanner() {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 300,
                height: 300,
            },
            fps: 10,
        });
    
        console.log("Initialisation du scanner");
    
        scanner.render(success, error);
    
        function success(result) {
            console.log("QR code détecté :", result);
            setScanResult(result);
            scanner.clear();
        }
    
        function error(err) {
            console.warn("Erreur de scan :", err);
        }
    
        return () => {
            scanner.clear();
        };
    }, []);

    useEffect(() => {
        // Appliquer la transformation CSS à l'élément vidéo lorsque le composant est monté
        const videoElement = document.querySelector('#reader video');
        if (videoElement) {
            videoElement.style.transform = 'scaleX(-1)'; // Flip horizontal
            videoElement.style.transformOrigin = 'center'; // Optional: keeps the center of the flip
        }
    }, []);

    return (
        <div>
            <h1>Scan</h1>
            {scanResult
                ? <div>Succès: {scanResult}</div>
                : <div>
                    <div id="reader" style={{ width: 800, height: 800 }}></div>
                    <p>En attente du scan...</p>
                  </div>
            }
        </div>
    );
}

export default Scanner;
