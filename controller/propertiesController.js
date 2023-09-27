import { validationResult} from 'express-validator'
import {Category, Price, Property} from '../models/index.js'

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
    //Create property

    const {title, description, bedrooms, parking, wc, street, lat, lng, price: priceId, category: categoryId} = req.body

    try {
        const propertySaved = await Property.create({
            title,
            description,
            bedrooms,
            parking,
            wc,
            street,
            lat,
            lng,
            priceId,
            categoryId,
            userId: req.user.id,
            image:' '
        })
        res.redirect(`/properties/add-image/${propertySaved.id}`)
    } catch (error) {
        console.log(error);
    }

}

export  {
    admin,
    create,
    save
}