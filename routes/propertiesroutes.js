import express from 'express'
import { body } from 'express-validator';

import {admin, create, save} from '../controller/propertiesController.js'
const router = express.Router();

router.get("/my-properties", admin);

router.get("/properties/create", create);
router.post("/properties/create", 
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

export default router