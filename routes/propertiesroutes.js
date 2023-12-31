import express from 'express'
import { body } from 'express-validator';
import protectPath from '../middleware/protectPath.js';
import {addImage, admin, create, save, saveImage, edit, saveChanges, deleteProperty, showProperty, sendMessage, showMessages, changeStatus} from '../controller/propertiesController.js'
import upload from '../middleware/uploadImage.js'
import { indentifyUser } from '../middleware/indentifyUser.js';


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

router.get("/properties/edit/:id", 
    protectPath,
    edit)

router.post("/properties/edit/:id", 
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
    saveChanges);
    
router.post("/properties/delete/:id", 
    protectPath,
    deleteProperty);
router.put("/property/:id", 
    protectPath,
    changeStatus);


//Public zone

router.get("/property/:id",indentifyUser,  showProperty)
router.post("/property/:id",
    body('message').isLength({min:10}).withMessage('El mensaje no puede ir vacio o es muy corto (minimo 10)'),
    indentifyUser,  
    sendMessage)

router.get("/messages/:id", protectPath, showMessages)


export default router