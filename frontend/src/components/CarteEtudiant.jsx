import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ufLogo from './images/uf.png';
import eniLogo from './images/ENI.jpeg';
import anniv from './images/annivENI.jpeg';

const CarteEtudiant = () => {
    const { matricule } = useParams();
    const [etudiant, setEtudiant] = useState(null);
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        document.title = 'Carte Étudiant - Université de Fianarantsoa';

        if (!matricule) {
            console.error("Matricule non défini");
            return;
        }
        axios.get(`http://localhost:8080/api/etudiants/carte/${matricule}`)
            .then((response) => {
                setEtudiant(response.data.etudiant);
                setQrCode(response.data.qrCode);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des informations de l'étudiant", error);
            });
    }, [matricule]);

    const handlePrint = () => {
        window.print();
    };

    if (!etudiant) {
        return <p>Chargement...</p>;
    }

    return (
        <>
            <div id="carte-etudiant" style={{ 
                position: 'relative', 
                border: '2px solid #aaa', 
                padding: '10px', 
                borderRadius: '10px', 
                width: '400px', 
                height: '260px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', 
                fontFamily: 'Arial, sans-serif',
                overflow: 'hidden', 
                marginTop:'100px',
                marginLeft:'100px'
            }}>
                <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundImage: `url(${anniv})`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3, 
                    zIndex: -1 
                }}></div>
            
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <img src={ufLogo} alt="Left Logo" style={{ width: '40px', height: '40px' }} />
                    <img src={eniLogo} alt="Right Logo" style={{ width: '40px', height: '40px' }} />
                </div>
            
                <div style={{ textAlign: 'center', marginBottom: '0px', marginTop:'-4   0px' }}>
                    <h2 style={{ margin: '0', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'normal' }}>
                        MINISTERE DE L'ENSEIGNEMENT SUPERIEUR
                    </h2>
                    <h3 style={{ margin: '0', fontSize: '14px', textTransform: 'uppercase' }}>
                        UNIVERSITE DE FIANARANTSOA
                    </h3>
                    <h3 style={{ margin: '0', fontSize: '14px', textTransform: 'uppercase' }}>
                        ECOLE NATIONALE D'INFORMATIQUE
                    </h3>
                    <p style={{ fontSize: '10px', marginTop: '0px', fontWeight: 'normal' }}>
                        "Ecole ingénieuse, pépinière des Élites informaticiennes à Madagascar"
                    </p>
                </div>
            
                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
                    <img src={`http://localhost:8080${etudiant.etudiant_photo}`} alt="Photo" style={{ width: '100px', height: '100px', border: '1px solid lightgreen', backgroundColor:'white', borderRadius:'5px' }} />
                    <div style={{marginLeft:'10px'}}>
                        <p style={{ margin: '0', fontSize: '10px' }}><strong>Nom:</strong> {etudiant.etudiant_nom}</p>
                        <p style={{ margin: '0', fontSize: '10px' }}><strong>Prénom(s):</strong> {etudiant.etudiant_prenom}</p>
                        <p style={{ margin: '0', fontSize: '10px' }}><strong>Né le:</strong> {etudiant.etudiant_date_naissance}</p>
                        <p style={{ margin: '0', fontSize: '10px' }}><strong>CIN:</strong> {etudiant.etudiant_cin}</p>
                        <p style={{ margin: '0', fontSize: '10px' }}><strong>Tél:</strong> {etudiant.etudiant_tel}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <p style={{ margin: '0', fontSize: '10px' }}><strong>Adresse:</strong> {etudiant.etudiant_address} </p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <img src={qrCode} alt="QR Code" style={{ width: '120px', height: '120px' }} />
                    </div>
                </div>
            
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', marginTop:'0' }}>
                    <div style={{ textAlign: 'left', fontSize: '10px' }}>
                        <p style={{ margin: '0' }}><strong>Matricule:</strong> {etudiant.etudiant_matricule}</p>
                        <p style={{ margin: '0' }}><strong>Parcours:</strong> {etudiant.etudiant_parcours}</p>
                        <p style={{ margin: '0' }}><strong>Niveau:</strong> {etudiant.etudiant_niveau}</p>  
                    </div>
                </div>
                <p style={{ textAlign: 'center', fontSize: '10px', marginTop: '10px' }}><strong>Année:</strong> {etudiant.etudiant_annee}</p>
            </div>

            {/* Bouton pour imprimer */}
            <button className="print-button bg-red-500 text-white px-4 py-2 rounded" onClick={handlePrint} style={{ marginTop: '20px', marginLeft:'220px', padding: '10px 20px', fontSize: '14px' }}>
                Imprimer la carte
            </button>

            <style>
    {`
        @media print {
            .print-button {
                display: none;
            }

            #carte-etudiant {
                position: relative;
                background: none !important; /* Ensure no background image is directly set */
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            /* Create a pseudo-element to handle the background image with opacity */
            #carte-etudiant::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url(${anniv}) !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                opacity: 0.3; /* Set the desired opacity */
                z-index: -1; /* Make sure the background is behind the content */
                pointer-events: none; /* Prevent interactions with the pseudo-element */
            }

            /* Ensure the page margins are minimal to show the full card */
            @page {
                margin: 0;
            }

            body {
                margin: 1cm; /* Adjust as needed */
            }
        }
    `}
</style>

        </>
    );
};

export default CarteEtudiant;