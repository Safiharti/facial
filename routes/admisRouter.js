const admisController = require('../controllers/admisController')

const router = require('express').Router()

router.post('/addAdmis', admisController.addAdmis)

router.get('/allAdmis', admisController.getAllAdmis)


router.get('/:id', admisController.getOneAdmis)

router.put('/:id', admisController.updateAdmis)

router.delete('/:id', admisController.deleteAdmis)

module.exports = router