const path = require('path');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const fs = require('fs').promises;

// Patch nodejs environment
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODELS_PATH = path.join(__dirname, '..', 'models');
const IMAGES_PATH = path.join(__dirname, '..', 'public', 'images');

let labeledFaceDescriptors;

// Charger les modèles
const loadModels = async () => {
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
};

// Charger les images des dossiers et utiliser les noms des dossiers comme étiquettes
const loadLabeledImages = async () => {
  const userFolders = await fs.readdir(IMAGES_PATH);
  return Promise.all(
    userFolders.map(async (folder) => {
      const descriptions = [];
      const userFolderPath = path.join(IMAGES_PATH, folder);
      
      // Lire toutes les images dans le dossier utilisateur
      const imageFiles = await fs.readdir(userFolderPath);
      for (const imageFile of imageFiles) {
        const imgPath = path.join(userFolderPath, imageFile);
        const img = await canvas.loadImage(imgPath);
        
        // Détecter les caractéristiques du visage
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (detection) {
          descriptions.push(detection.descriptor);
        }
      }

      // Retourner les descripteurs étiquetés par le nom du dossier (nom de l'utilisateur)
      return new faceapi.LabeledFaceDescriptors(folder, descriptions);
    })
  );
};

// Initialiser le système de reconnaissance faciale
const initializeFaceRecognition = async () => {
  try {
    await loadModels();
    labeledFaceDescriptors = await loadLabeledImages();
    console.log('Models and labeled face descriptors loaded');
  } catch (error) {
    console.error('Error initializing face recognition:', error);
  }
};

// Fonction pour reconnaître le visage à partir du descripteur
const recognizeFace = async (faceDescriptor) => {
  if (!labeledFaceDescriptors) {
    throw new Error('Face recognition system not initialized');
  }

  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  const descriptor = new Float32Array(faceDescriptor);
  return faceMatcher.findBestMatch(descriptor);
};

// Route API pour la reconnaissance faciale
const handleFaceRecognition = async (req, res) => {
  console.log("Received face data:", req.body);
  try {
    const { faceDescriptor } = req.body;

    if (!faceDescriptor) {
      return res.status(400).json({ success: false, message: 'No face descriptor provided' });
    }

    const match = await recognizeFace(faceDescriptor);

    if (match.label !== 'unknown') {
      res.json({ success: true, message: `Face recognized`, user: match.label });
    } else {
      res.json({ success: false, message: 'Face not recognized' });
    }
  } catch (error) {
    console.error('Error during face recognition:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Initialiser les modèles et descripteurs de visage lors du démarrage du serveur
initializeFaceRecognition();

module.exports = {
  recognizeFace,
  handleFaceRecognition
};
