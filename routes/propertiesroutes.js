import express from 'express'
import { body } from 'express-validator';
import protectPath from '../middleware/protectPath.js';
import {addImage, admin, create, save, saveImage} from '../controller/propertiesController.js'
import upload from '../middleware/uploadImage.js'


const router = express.Router();

router.get("/my-properties", protectPath, admin);

router.get("/properties/create", protectPath,create);
router.post("/properties/create", 
    protectPath,
    body('title').notEmpty().withMessage('El título del anuncio es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción no puede ir vacía')
        .isLength({max:200}).withMessage('La descripción es muy larga'),
    body('category').isNumeric().withMessage('Debes seleccionar una categoría'),
    body('price').isNumeric().withMessage('Debes seleccionar un rango de precios'),
    body('bedrooms').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('parking').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de wc'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

    save);
router.get("/properties/add-image/:id", 
    protectPath,
    addImage)

router.post("/properties/add-image/:id",  
    protectPath,
    upload.single('image'),
    saveImage
)

export default router