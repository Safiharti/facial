const etudiantController = require('../controllers/etudiantController')

const router = require('express').Router()

router.post('/addEtudiant', etudiantController.addEtudiant)

router.get('/allEtudiant', etudiantController.getAllEtudiants)



router.get('/:etudiant_matricule', etudiantController.getOneEtudiant)

router.put('/:etudiant_matricule', etudiantController.updateEtudiant)

router.delete('/:etudiant_matricule', etudiantController.deleteEtudiant)



//QR CODE
router.get('/carte/:etudiant_matricule', etudiantController.getEtudiantCard);


module.exports = router