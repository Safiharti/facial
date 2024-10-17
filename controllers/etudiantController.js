const { where } = require('sequelize');
const db = require('../models');
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');

// Model principale
const Admis = db.admis;
const Etudiant = db.etudiants;
const Responsable = db.Responsable;

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './profil');  // dossier pour stocker les images
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);  // obtenir l'extension du fichier
        const etudiantMatricule = req.body.etudiant_matricule || Date.now();  // fallback au cas où le matricule n'est pas encore disponible
        cb(null, `${etudiantMatricule}${extension}`);  // nom du fichier basé sur le matricule
    }
});

const upload = multer({ storage: storage }).single('etudiant_photo');

// Ajout
const addEtudiant = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ message: 'Erreur lors du téléchargement de la photo.' });
        }

        let info = {
            etudiant_nom: req.body.etudiant_nom,
            etudiant_prenom: req.body.etudiant_prenom,
            etudiant_tel: req.body.etudiant_tel,
            etudiant_mail: req.body.etudiant_mail,
            etudiant_parcours: req.body.etudiant_parcours,
            etudiant_niveau: req.body.etudiant_niveau,
            etudiant_date_naissance: req.body.etudiant_date_naissance,
            etudiant_lieu_naissance: req.body.etudiant_lieu_naissance,
            etudiant_cin: req.body.etudiant_cin,
            etudiant_bordereau: req.body.etudiant_bordereau,
            etudiant_annee: req.body.etudiant_annee,
            etudiant_etat: req.body.etudiant_etat,
            etudiant_photo: req.file ? `/profil/${req.file.filename}` : null  // chemin vers la photo si elle a été uploadée
        };

        try {
            const etudiant = await Etudiant.create(info);
            res.status(200).send(etudiant);
        } catch (error) {
            res.status(500).send({ message: 'Erreur lors de la création de l\'étudiant.' });
        }
    });
};

// GET ALL

const getAllEtudiants = async (req, res) => {
    let etudiants = await Etudiant.findAll({})
    res.status(200).send(etudiants)
}


//GET ONE
const getOneEtudiant = async (req, res) => {
    let etudiant_matricule = req.params.etudiant_matricule
    let etudiant = await Etudiant.findOne({where : {etudiant_matricule : etudiant_matricule}})
    res.status(200).send(etudiant)
}

//UPDATE
const updateEtudiant = async (req, res) => {
    let etudiant_matricule = req.params.etudiant_matricule
    const etudiant = await Etudiant.update(req.body, {where : {etudiant_matricule, etudiant_matricule}})
    res.status(200).send(etudiant)
}


//DELETE 
const deleteEtudiant = async (req, res) => {
    let etudiant_matricule = req.params.etudiant_matricule
    await Etudiant.destroy({where : { etudiant_matricule , etudiant_matricule}})
    res.status(200).send('Admis supprimé')
}

// GENERATION DE QR CODE
const getEtudiantCard = async(req, res) => {
    const etudiant_matricule = req.params.etudiant_matricule;
    console.log("Matricule reçu:", etudiant_matricule);

    const etudiant = await Etudiant.findOne({ where: { etudiant_matricule: etudiant_matricule } });
    console.log("Étudiant trouvé:", etudiant);

    if (!etudiant) {
        return res.status(404).send({ message: "Étudiant non trouvé" });
    }

    // Convertir les informations de l'étudiant en JSON
    let info = {
        etudiant_matricule: etudiant.etudiant_matricule,
        etudiant_nom: etudiant.etudiant_nom,
        etudiant_prenom: etudiant.etudiant_prenom,
        etudiant_tel: etudiant.etudiant_tel,
        etudiant_mail: etudiant.etudiant_mail,
        etudiant_parcours: etudiant.etudiant_parcours,
        etudiant_niveau: etudiant.etudiant_niveau,
        etudiant_date_naissance: etudiant.etudiant_date_naissance,
        etudiant_lieu_naissance: etudiant.etudiant_lieu_naissance,
        etudiant_cin: etudiant.etudiant_cin,
        etudiant_bordereau: etudiant.etudiant_bordereau,
        etudiant_annee: etudiant.etudiant_annee,
        etudiant_etat: etudiant.etudiant_etat,
        etudiant_photo: etudiant.etudiant_photo
    };

    // Générer le QR code
    QRCode.toDataURL(JSON.stringify(info), (err, qrCode) => {
        if (err) {
            return res.status(500).send({ message: "Erreur lors de la génération du QR code" });
        }

        // Renvoyer les infos et le QR code en base64
        res.status(200).send({ etudiant: info, qrCode });
    });
}

module.exports = {
    addEtudiant,
    getAllEtudiants,
    getOneEtudiant,
    updateEtudiant,
    deleteEtudiant,
    getEtudiantCard
}