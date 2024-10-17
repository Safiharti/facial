import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTimes, faBars,  faUniversity } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
    };

    

    return (
        <header className="bg-green-700 text-white p-3">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-2xl font-bold flex" style={{alignContent:'center', alignItems:'center'}}>
                    <p className='mr-4'>ENI</p>
                    <FontAwesomeIcon icon={faUniversity} className='mt-1' />
                </div>
                <nav className={`hidden md:flex space-x-4`}>
                    <Link to="/" className="hover:bg-green-600 px-3 py-2 rounded">Accueil</Link>
                    <Link to="/scanner" className="hover:bg-green-600 px-3 py-2 rounded">Scanner</Link>
                    <Link to="/etudiants" className="hover:bg-green-600 px-3 py-2 rounded">Etudiants</Link>
                    <Link to="/admis" className="hover:bg-green-600 px-3 py-2 rounded">Admis</Link>
                </nav>
                <button className="md:hidden text-xl" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            {isMenuOpen && (
                <div className="fixed inset-0 bg-green-800 bg-opacity-90 z-50 flex flex-col items-end p-4">
                    <button className="text-white text-2xl" onClick={() => setIsMenuOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <nav className="mt-4 space-y-2">
                        <Link to="/" className="block text-white hover:bg-green-600 px-4 py-2 rounded">Accueil</Link>
                        <Link to="/scanner" className="block text-white hover:bg-green-600 px-4 py-2 rounded">Scanner</Link>
                        <Link to="/etudiants" className="block text-white hover:bg-green-600 px-4 py-2 rounded">Etudiants</Link>
                        <Link to="/admis" className="block text-white hover:bg-green-600 px-4 py-2 rounded">Admis</Link>
                        <hr />
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;