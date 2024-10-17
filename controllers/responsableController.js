const { where } = require('sequelize')
const db = require('../models')

// Model principale
const Admis = db.admis
const Etudiant = db.etudiants
const Responsable = db.responsables
// Fonctionnalité

// Ajout

const addResponsable = async(req, res) => {
    let info = {
        responsable_nom : req.body.responsable_nom,
        responsable_prenom : req.body.responsable_prenom,
        responsable_tel : req.body.responsable_tel,
        responsable_mail : req.body.responsable_mail,
        responsable_mdp : req.body.responsable_mdp,
    }

    const responsable = await Responsable.create(info)
    res.status(200).send(responsable)
}

// GET ALL

const getAllResponsable = async (req, res) => {
    let responsables = await Responsable.findAll({})
    res.status(200).send(responsables)
}


//GET ONE
const getOneResponsable = async (req, res) => {
    let id = req.params.id
    let responsable = await Responsable.findOne({where : {id : id}})
    res.status(200).send(responsable)
}

//UPDATE
const updateResponsable = async (req, res) => {
    let id = req.params.id
    const responsable = await Responsable.update(req.body, {where : {id, id}})
    res.status(200).send(responsable)
}


//DELETE 
const deleteResponsable = async (req, res) => {
    let id = req.params.id
    await Responsable.destroy({where : { id , id}})
    res.status(200).send('Responsable supprimé')
}

module.exports = {
    addResponsable,
    getAllResponsable,
    getOneResponsable,
    updateResponsable,
    deleteResponsable
}