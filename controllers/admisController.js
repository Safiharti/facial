const { where } = require('sequelize')
const db = require('../models')

// Model principale
const Admis = db.admis
const Etudiant = db.etudiants
const Responsable = db.Responsable
// Fonctionnalité

// Ajout

const addAdmis = async(req, res) => {
    let info = {
        admis_nom : req.body.admis_nom,
        admis_prenom : req.body.admis_prenom,
        admis_tel : req.body.admis_tel,
        admis_mail : req.body.admis_mail,
        admis_parcours : req.body.admis_parcours
    }

    const admis = await Admis.create(info)
    res.status(200).send(admis)
}

// GET ALL

const getAllAdmis = async (req, res) => {
    let admis = await Admis.findAll({})
    res.status(200).send(admis)
}


//GET ONE
const getOneAdmis = async (req, res) => {
    let id = req.params.id
    let admis = await Admis.findOne({where : {id : id}})
    res.status(200).send(admis)
}

//UPDATE
const updateAdmis = async (req, res) => {
    let id = req.params.id
    const admis = await Admis.update(req.body, {where : {id, id}})
    res.status(200).send(admis)
}


//DELETE 
const deleteAdmis = async (req, res) => {
    let id = req.params.id
    const admis = await Admis.destroy({where : {id, id}})
    res.status(200).send('Admis supprimé')
}

module.exports = {
    addAdmis,
    getAllAdmis,
    getOneAdmis,
    updateAdmis,
    deleteAdmis
}