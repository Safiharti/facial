import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root');
const Etudiant = () => {
    const [etudiants, setEtudiants] = useState([]);
    const [selectedEtudiant, setSelectedEtudiant] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
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
        etudiant_bordereau:'',
        etudiant_annee:'',
        etudiant_photo:'',
        etudiant_etat:'',
    });

    const navigate = useNavigate();


    useEffect(() => {
        const fetchEtudiants = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/etudiants/alletudiant');
                setEtudiants(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchEtudiants();
    }, []);

    const filteredEtudiants = etudiants.filter(etudiant =>
        etudiant.etudiant_nom.toLowerCase().includes(search.toLowerCase()) ||
        etudiant.etudiant_prenom.toLowerCase().includes(search.toLowerCase()) ||
        etudiant.etudiant_tel.toLowerCase().includes(search.toLowerCase()) ||
        etudiant.etudiant_mail.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedEtudiants = filteredEtudiants.slice(
        (currentPage - 1) * entries,
        currentPage * entries
    );

    const totalPages = Math.ceil(filteredEtudiants.length / entries);

    const openEditModal = (etudiant) => {
        setSelectedEtudiant(etudiant);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEtudiant(null);
    };

    const openDeleteModal = (etudiant) => {
        setSelectedEtudiant(etudiant);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedEtudiant(null);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewEtudiant({
            etudiant_nom: '',
            etudiant_prenom: '',
            etudiant_tel: '',
            etudiant_mail: '',
            etudiant_parcours: '',
            etudiant_niveau: '',
            etudiant_date_naissance: '',
            etudiant_lieu_naissance: '',
            etudiant_cin: '',
            etudiant_bordereau:'',
            etudiant_annee:'',
            etudiant_etat:'',
            etudiant_photo:''
        });
    };

    const openSuccessModal = () => {
        setIsSuccessModalOpen(true);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedEtudiant({ ...selectedEtudiant, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/etudiants/${selectedEtudiant.etudiant_matricule}`, selectedEtudiant);
            setEtudiants(etudiants.map(etudiant => (etudiant.etudiant_matricule === selectedEtudiant.etudiant_matricule ? selectedEtudiant : etudiant)));
            closeEditModal();
            openSuccessModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/etudiants/${selectedEtudiant.etudiant_matricule}`);
            setEtudiants(etudiants.filter(etudiant => etudiant.etudiant_matricule !== selectedEtudiant.etudiant_matricule));
            closeDeleteModal();
            openSuccessModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewEtudiant({ ...newEtudiant, [name]: value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/etudiants/addEtudiant', newEtudiant);
            setEtudiants([...etudiants, response.data]);
            closeAddModal();
            openSuccessModal();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
        }
    };

    return (
        <div className="p-4 bg-green-50">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-lg" style={{ width: '90%', margin: 'auto' }}>
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold mb-4">Étudiants</h1>
                    <button onClick={openAddModal} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 d-none">
                        Ajouter
                    </button>
                </div>
                <br />
                <hr />
                <br />
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <select
                        value={entries}
                        onChange={(e) => setEntries(Number(e.target.value))}
                        className="ml-4 border border-gray-300 rounded-md p-2"
                    >
                        {[10, 25, 50].map((num) => (
                            <option key={num} value={num}>
                                Afficher {num}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Matricule</th>
                            <th className="border border-gray-300 p-2">Nom</th>
                            <th className="border border-gray-300 p-2">Prénom</th>
                            <th className="border border-gray-300 p-2">Téléphone</th>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">Parcours</th>
                            <th className="border border-gray-300 p-2">Niveau</th>
                            <th className="border border-gray-300 p-2">Date de naissance</th>
                            <th className="border border-gray-300 p-2">Lieu de naissance</th>
                            <th className="border border-gray-300 p-2">CIN</th>
                            <th className="border border-gray-300 p-2">Bordereau</th>
                            <th className="border border-gray-300 p-2">Annee</th>
                            <th className="border border-gray-300 p-2">Etat</th>
                            <th className="border border-gray-300 p-2">Photo</th>
                            <th className="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEtudiants.map(etudiant => (
                            <tr key={etudiant.id}>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_matricule}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_nom}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_prenom}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_tel}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_mail}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_parcours}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_niveau}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_date_naissance}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_lieu_naissance}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_cin}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_bordereau}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_annee}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_etat}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign: 'center' }}>{etudiant.etudiant_photo}</td>
                                <td className="border border-gray-300 p-2" style={{ width: '275px' }}>
                                    <button
                                        onClick={() => openEditModal(etudiant)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(etudiant)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Supprimer
                                    </button>
                                    <button
                                        onClick={() => navigate(`/carte/${etudiant.etudiant_matricule}`)}
                                        className="bg-green-500 text-white px-4 py-2 rounded ml-1"
                                    >
                                        Voir Carte
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                    <div>
                        <span>Page {currentPage} sur {totalPages}</span>
                    </div>
                    <div className="flex">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Ajout */}
            <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Ajouter un étudiant</h2>
                    <form onSubmit={handleAddSubmit}>
                        <input
                            type="text"
                            name="etudiant_nom"
                            value={newEtudiant.etudiant_nom}
                            onChange={handleAddChange}
                            placeholder="Nom"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_prenom"
                            value={newEtudiant.etudiant_prenom}
                            onChange={handleAddChange}
                            placeholder="Prénom"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="tel"
                            name="etudiant_tel"
                            value={newEtudiant.etudiant_tel}
                            onChange={handleAddChange}
                            placeholder="Téléphone"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="email"
                            name="etudiant_mail"
                            value={newEtudiant.etudiant_mail}
                            onChange={handleAddChange}
                            placeholder="Email"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_parcours"
                            value={newEtudiant.etudiant_parcours}
                            onChange={handleAddChange}
                            placeholder="Parcours"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_niveau"
                            value={newEtudiant.etudiant_niveau}
                            onChange={handleAddChange}
                            placeholder="Niveau"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="date"
                            name="etudiant_date_naissance"
                            value={newEtudiant.etudiant_date_naissance}
                            onChange={handleAddChange}
                            placeholder="Date de Naissance"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_lieu_naissance"
                            value={newEtudiant.etudiant_lieu_naissance}
                            onChange={handleAddChange}
                            placeholder="Lieu de Naissance"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_cin"
                            value={newEtudiant.etudiant_cin}
                            onChange={handleAddChange}
                            placeholder="CIN"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_bordereau"
                            value={newEtudiant.etudiant_bordereau}
                            onChange={handleAddChange}
                            placeholder="Numéro de Bordereau"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_annee"
                            value={newEtudiant.etudiant_annee}
                            onChange={handleAddChange}
                            placeholder="Année"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_photo"
                            value={newEtudiant.etudiant_photo}
                            onChange={handleAddChange}
                            placeholder="Mot de passe"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="etudiant_etat"
                            value={newEtudiant.etudiant_etat}
                            onChange={handleAddChange}
                            placeholder="Mot de passe"
                            className="border border-gray-300 rounded-md p-2 w-full mb-2"
                            required
                        />
                        <div className="flex justify-end">
                            <button type="button" onClick={closeAddModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Annuler</button>
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>


            {/* Modal Modifier */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Modifier l'étudiant</h2>
                    {selectedEtudiant && (
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                name="etudiant_nom"
                                value={selectedEtudiant.etudiant_nom}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_prenom"
                                value={selectedEtudiant.etudiant_prenom}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="tel"
                                name="etudiant_tel"
                                value={selectedEtudiant.etudiant_tel}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="email"
                                name="etudiant_mail"
                                value={selectedEtudiant.etudiant_mail}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_parcours"
                                value={selectedEtudiant.etudiant_parcours}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_niveau"
                                value={selectedEtudiant.etudiant_niveau}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="date"
                                name="etudiant_date_naissance"
                                value={selectedEtudiant.etudiant_date_naissance}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_lieu_naissance"
                                value={selectedEtudiant.etudiant_lieu_naissance}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_cin"
                                value={selectedEtudiant.etudiant_cin}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_bordereau"
                                value={selectedEtudiant.etudiant_bordereau}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_annee"
                                value={selectedEtudiant.etudiant_annee}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_photo"
                                value={selectedEtudiant.etudiant_photo}
                                onChange={handleEditChange}
                                placeholder="Mot de passe"
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <input
                                type="text"
                                name="etudiant_etat"
                                value={selectedEtudiant.etudiant_photo}
                                onChange={handleEditChange}
                                placeholder="Mot de passe"
                                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                                required
                            />
                            <div className="flex justify-end">
                                <button type="button" onClick={closeEditModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Annuler</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enregistrer</button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>


            {/* Modal Supprimer */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Supprimer l'étudiant</h2>
                    {selectedEtudiant && (
                        <div>
                            <p>Êtes-vous sûr de vouloir supprimer {selectedEtudiant.etudiant_nom} {selectedEtudiant.etudiant_prenom} ?</p>
                            <div className="flex justify-end mt-4">
                                <button type="button" onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Annuler</button>
                                <button onClick={handleDeleteSubmit} className="bg-red-500 text-white px-4 py-2 rounded">Supprimer</button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal Succès */}
            <Modal isOpen={isSuccessModalOpen} onRequestClose={closeSuccessModal}>
                <div className="p-4 flex flex-col items-center">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-4xl mb-4" />
                    <p className="text-lg">Opération réussie !</p>
                    <button onClick={closeSuccessModal} className="bg-green-500 text-white px-4 py-2 rounded mt-4">OK</button>
                </div>
            </Modal>
        </div>
    );
};

export default Etudiant;
