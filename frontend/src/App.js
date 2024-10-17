import React from 'react';
import './index.css';
import CarteEtudiant from './components/CarteEtudiant';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scanner from './components/Scanner';
import Etudiant from './components/Etudiant';
import Admis from './components/Admis';
import Navbar from './utils/Navbar';
import EtudiantInscription from './components/EtudiantInscription';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/scanner" element={<Scanner />} />
                    <Route path="/etudiants" element={<Etudiant />} />
                    <Route path="/admis" element={<Admis />} />
                    <Route path="/inscription" element={<EtudiantInscription />} />
                    <Route path="/carte/:matricule" element={<CarteEtudiant />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
