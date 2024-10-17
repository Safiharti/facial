const express = require('express');
const router = express.Router();
const { handleFaceRecognition } = require('../controllers/faceRecognitionController');

router.post('/', handleFaceRecognition);

module.exports = router;
