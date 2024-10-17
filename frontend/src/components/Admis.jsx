import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');
const Admis = () => {
    const [admis, setAdmis] = useState([]);
    const [selectedAdmi, setSelectedAdmi] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [newAdmi, setNewAdmi] = useState({
        admis_nom: '',
        admis_prenom: '',
        admis_tel: '',
        admis_mail: '',
        admis_parcours: '',
    });

    useEffect(() => {
        const fetchAdmis = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admis/allAdmis');
                setAdmis(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAdmis();
    }, []);

    const filteredAdmis = admis.filter(admi =>
        admi.admis_nom.toLowerCase().includes(search.toLowerCase()) ||
        admi.admis_prenom.toLowerCase().includes(search.toLowerCase()) ||
        admi.admis_tel.toLowerCase().includes(search.toLowerCase()) ||
        admi.admis_mail.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedAdmis = filteredAdmis.slice(
        (currentPage - 1) * entries,
        currentPage * entries
    );

    const totalPages = Math.ceil(filteredAdmis.length / entries);

    const openEditModal = (admi) => {
        setSelectedAdmi(admi);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAdmi(null);
    };

    const openDeleteModal = (admi) => {
        setSelectedAdmi(admi);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedAdmi(null);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewAdmi({
            admis_nom: '',
            admis_prenom: '',
            admis_tel: '',
            admis_mail: '',
            admis_parcours: '',
        });
    };

    const openSuccessModal = () =>{
        setIsSuccessModalOpen(true);
    }

    const closeSuccessModal = () =>{
        setIsSuccessModalOpen(false);
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedAdmi({ ...selectedAdmi, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/admis/${selectedAdmi.id}`, selectedAdmi);
            setAdmis(admis.map(admi => (admi.id === selectedAdmi.id ? selectedAdmi : admi)));
            closeEditModal();
            openSuccessModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/admis/${selectedAdmi.id}`);
            setAdmis(admis.filter(admi => admi.id !== selectedAdmi.id));
            closeDeleteModal();
            openSuccessModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewAdmi({ ...newAdmi, [name]: value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/admis/addAdmis', newAdmi);
            setAdmis([...admis, response.data]);
            closeAddModal();
            openSuccessModal();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l admis:', error);
        }
    };
    

    return (
        <div className="p-4 bg-green-50">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-lg" style={{ width: '90%', margin: 'auto' }}>
                <div className="flex" style={{justifyContent:'space-between'}}>
                    <h1 className="text-2xl font-bold mb-4">Admis</h1>
                    
                    <button
                        onClick={openAddModal}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
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
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Nom</th>
                            <th className="border border-gray-300 p-2">Prénom</th>
                            <th className="border border-gray-300 p-2">Tel</th>
                            <th className="border border-gray-300 p-2">Mail</th>
                            <th className="border border-gray-300 p-2">Parcours</th>
                            <th className="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAdmis.map(admi => (
                            <tr key={admi.id}>
                                <td className="border border-gray-300 p-2" style={{ textAlign:'center' }}>{admi.id}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign:'center' }}>{admi.admis_nom}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign:'center' }}>{admi.admis_prenom}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign:'center' }}>{admi.admis_tel}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign:'center' }}>{admi.admis_mail}</td>
                                <td className="border border-gray-300 p-2" style={{ textAlign:'center' }}>{admi.admis_parcours}</td>
                                <td className="border border-gray-300 p-2" style={{ width: '275px' }}>
                                    <button
                                        onClick={() => openEditModal(admi)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(admi)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Supprimer
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

                {/* Edit Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold">Modifier un admis</h2>
                            <button onClick={closeEditModal} className="close-btn" style={{fontWeight:'800', color:'red'}}>
                                &times;
                            </button>
                        </div>
                        <hr />
                        <br />
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="admis_nom" className="block text-sm font-medium">Nom :</label>
                                <input
                                    type="text"
                                    id="admis_nom"
                                    name="admis_nom"
                                    value={selectedAdmi?.admis_nom || ''}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_prenom" className="block text-sm font-medium">Prénom :</label>
                                <input
                                    type="text"
                                    id="admis_prenom"
                                    name="admis_prenom"
                                    value={selectedAdmi?.admis_prenom || ''}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_tel" className="block text-sm font-medium">Téléphone :</label>
                                <input
                                    type="text"
                                    id="admis_tel"
                                    name="admis_tel"
                                    value={selectedAdmi?.admis_tel || ''}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_mail" className="block text-sm font-medium">Email :</label>
                                <input
                                    type="email"
                                    id="admis_mail"
                                    name="admis_mail"
                                    value={selectedAdmi?.admis_mail || ''}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_parcours" className="block text-sm font-medium">Parcours :</label>
                                <input
                                    type="text"
                                    id="admis_parcours"
                                    name="admis_parcours"
                                    value={selectedAdmi?.admis_parcours || ''}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Sauvegarder</button>
                            <button onClick={closeEditModal} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
                        </form>
                    </div>
                </Modal>

                {/* Delete Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={closeDeleteModal}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold">Supprimer un admis</h2>
                            <button onClick={closeDeleteModal} className="close-btn" style={{fontWeight:'800', color:'red'}}>
                                &times;
                            </button>
                        </div>
                        <hr />
                        <br />
                        <p>Êtes-vous sûr de vouloir supprimer <strong>{selectedAdmi?.admis_nom} {selectedAdmi?.admis_prenom}</strong> ?</p>
                        <button onClick={handleDeleteSubmit} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Supprimer</button>
                        <button onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
                    </div>
                </Modal>

                {/* Add Modal */}
                <Modal
                    isOpen={isAddModalOpen}
                    onRequestClose={closeAddModal}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold">Ajouter un admis</h2>
                            <button onClick={closeAddModal} className="close-btn" style={{fontWeight:'800', color:'red'}}>
                                &times;
                            </button>
                        </div>
                        <hr />
                        <br />
                        <form onSubmit={handleAddSubmit}>
                            <div className="mb-4">
                                <label htmlFor="admis_nom" className="block text-sm font-medium">Nom :</label>
                                <input
                                    type="text"
                                    id="admis_nom"
                                    name="admis_nom"
                                    value={newAdmi.admis_nom}
                                    onChange={handleAddChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_prenom" className="block text-sm font-medium">Prénom :</label>
                                <input
                                    type="text"
                                    id="admis_prenom"
                                    name="admis_prenom"
                                    value={newAdmi.admis_prenom}
                                    onChange={handleAddChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_tel" className="block text-sm font-medium">Téléphone :</label>
                                <input
                                    type="text"
                                    id="admis_tel"
                                    name="admis_tel"
                                    value={newAdmi.admis_tel}
                                    onChange={handleAddChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_mail" className="block text-sm font-medium">Email :</label>
                                <input
                                    type="email"
                                    id="admis_mail"
                                    name="admis_mail"
                                    value={newAdmi.admis_mail}
                                    onChange={handleAddChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="admis_parcours" className="block text-sm font-medium">Parcours :</label>
                                <input
                                    type="text"
                                    id="admis_parcours"
                                    name="admis_parcours"
                                    value={newAdmi.admis_parcours}
                                    onChange={handleAddChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Ajouter</button>
                            <button onClick={closeAddModal} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
                        </form>
                    </div>
                </Modal>

                {/* Success Modal */}
                <Modal
                    isOpen={isSuccessModalOpen}
                    onRequestClose={closeSuccessModal}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold text-green-500">Succès</h2>
                            <button onClick={closeSuccessModal} className="close-btn">
                                <FontAwesomeIcon icon={faCircleCheck} size="2x" style={{ color: 'green' }} />
                            </button>
                        </div>
                        <hr />
                        <br />
                        <p>L'opération a été effectuée avec succès !</p>
                        <button onClick={closeSuccessModal} className="bg-green-500 text-white px-4 py-2 rounded">OK</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Admis;
