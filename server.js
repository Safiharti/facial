const express = require('express')
const cors = require('cors')
const exp = require('constants')

const app = express()

//Middleware
app.use(cors());

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use('/profil', express.static('profil'));


//Routers
const router = require('./routes/admisRouter.js')
const etd_router = require('./routes/etudiantRouter.js')
const rsp_router = require('./routes/responsableRouter.js')
const faceRecognitionRoute = require('./routes/faceRecognitionRouter.js');
app.use('/api/admis', router)
app.use('/api/etudiants', etd_router)
app.use('/api/responsable', rsp_router)
app.use('/api/face-recognition', faceRecognitionRoute);

app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules'"
    );
    next();
  });

//Test API
app.get('/', (req, res) =>{
    res.json({message: 'Hello world'})
})

//PORT
const PORT = process.env.PORT ||8080

app.listen(PORT, ()=>{
    console.log(`server is running in port ${PORT}`)
})
