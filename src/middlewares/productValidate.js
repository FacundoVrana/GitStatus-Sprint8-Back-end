const path = require('path');
const {body} = require ('express-validator');
const {User} = require('../database/models');


const productValidate = [
    body('name').isLength({min:5}).withMessage('Elegir un nombre de 5 caracteres mínimo').bail(),
    body('description').isLength({min:20}).withMessage('Escribir mínimo 20 caracteres').bail(),
    body('brand').notEmpty().withMessage('Debe ingresar una marca').bail(),
    body('image').custom((value, {req}) =>{
        let file = req.file;
        let acceptedExtensions = ['.JPEG', '.jpg', '.png', '.gif'];
            if(file){
                let fileExtension = path.extname(file.originalname);
                if (!acceptedExtensions.includes(fileExtension)) {
                    throw new Error (`Las extenciones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
                }
            }
        return true;
    }).bail()
       
]
module.exports = productValidate;