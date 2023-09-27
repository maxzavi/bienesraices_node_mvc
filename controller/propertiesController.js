import { validationResult} from 'express-validator'
import Category from '../models/Category.js'
import Price from '../models/Price.js'

const admin = (req,res)=>{
    res.render('properties/admin',{
        page:'Mis propiedades',
        bar: true
    });
}

const create = async  (req, res)=>{

    const [categories, prices] =await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/create',{
        page:'Crear propiedad',
        bar:true,
        categories,
        prices,
        csrfToken: req.csrfToken(),
        data:{}
    })
}

const save = async (req, res)=>{
    //Validation
    let result = validationResult(req);
    if (!result.isEmpty()){
        const [categories, prices] =await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/create',{
            page:'Crear propiedad',
            bar:true,
            categories,
            prices, 
            errores: result.array(),
            csrfToken: req.csrfToken(),
            data: req.body
        })
    }

}

export  {
    admin,
    create,
    save
}