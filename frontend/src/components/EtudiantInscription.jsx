import React, { useState } from 'react';
import axios from 'axios';

const EtudiantInscription = () => {
    const [etudiants, setEtudiants] = useState([]);
    const [newEtudiant, setNewEtudiant] = useState({
        etudiant_nom: '',
        etudiant_prenom: '',
        etudiant_tel: '',
        etudiant_mail: '',
        etudiant_parcours: '',
        etudiant_niveau: '',
        etudiant_date_naissance: '',
        etudiant_lieu_naissance: '',
        etudiant_cin: '',
        etudiant_bordereau: '',
        etudiant_annee: '',
        etudiant_etat: ''
    });
    const [etudiantPhoto, setEtudiantPhoto] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEtudiant({ ...newEtudiant, [name]: value });
    };

    const handlePhotoChange = (e) => {
        setEtudiantPhoto(e.target.files[0]);  // mettre à jour la photo sélectionnée
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Ajouter tous les champs au formData
        for (let key in newEtudiant) {
            formData.append(key, newEtudiant[key]);
        }
        if (etudiantPhoto) {
            formData.append('etudiant_photo', etudiantPhoto);  // ajouter la photo au formData
        }

        try {
            const response = await axios.post('http://localhost:8080/api/etudiants/addEtudiant', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setEtudiants([...etudiants, response.data]);
            setMessage('Étudiant ajouté avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
            setMessage('Erreur lors de l\'ajout de l\'étudiant');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Inscription Étudiant</h2>

                {message && (
                    <div className={`mb-4 p-2 rounded text-white ${message.includes('succès') ? 'bg-green-500' : 'bg-red-500'}`}>
                        {message}
                    </div>
                )}

                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="etudiant_nom" value={newEtudiant.etudiant_nom} onChange={handleChange} placeholder="Nom" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_prenom" value={newEtudiant.etudiant_prenom} onChange={handleChange} placeholder="Prénom" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="tel" name="etudiant_tel" value={newEtudiant.etudiant_tel} onChange={handleChange} placeholder="Téléphone" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="email" name="etudiant_mail" value={newEtudiant.etudiant_mail} onChange={handleChange} placeholder="Email" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_parcours" value={newEtudiant.etudiant_parcours} onChange={handleChange} placeholder="Parcours" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_niveau" value={newEtudiant.etudiant_niveau} onChange={handleChange} placeholder="Niveau" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="date" name="etudiant_date_naissance" value={newEtudiant.etudiant_date_naissance} onChange={handleChange} placeholder="Date de Naissance" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_lieu_naissance" value={newEtudiant.etudiant_lieu_naissance} onChange={handleChange} placeholder="Lieu de Naissance" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_cin" value={newEtudiant.etudiant_cin} onChange={handleChange} placeholder="CIN" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_bordereau" value={newEtudiant.etudiant_bordereau} onChange={handleChange} placeholder="Numéro de Bordereau" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="text" name="etudiant_annee" value={newEtudiant.etudiant_annee} onChange={handleChange} placeholder="Année" className="border border-gray-300 rounded-md p-2 w-full mb-2" required />
                        <input type="file" name="etudiant_photo" onChange={handlePhotoChange} className="border border-gray-300 rounded-md p-2 w-full mb-4" required />
                        <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Ajouter</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EtudiantInscription;
