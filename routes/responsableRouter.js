const responsableController = require('../controllers/responsableController')

const router = require('express').Router()

router.post('/addResponsable', responsableController.addResponsable)

router.get('/allResponsable', responsableController.getAllResponsable)


router.get('/:id', responsableController.getOneResponsable)

router.put('/:id', responsableController.updateResponsable)

router.delete('/:id', responsableController.deleteResponsable)

module.exports = router