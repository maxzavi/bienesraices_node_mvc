import { validationResult} from 'express-validator'
import { unlink } from 'node:fs/promises'
import {Category, Price, Property} from '../models/index.js'

const admin = async (req,res)=>{
    const { id } = req.user
    const properties = await Property.findAll({
        where:{
            userId:id
        },
        include:[
            {model: Category, as: 'category'},
            {model: Price, as:'price'}
        ]
    })
    res.render('properties/admin',{
        page:'Mis propiedades',
        bar: true,
        properties,
        csrfToken: req.csrfToken()
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

const addImage = async (req, res)=> {
    const { id } = req.params
    
    //Validate exists property
    const property = await Property.findByPk(id)
    if(!property){
        return res.redirect("/my-properties")
    }
    //Valdate property is not published

    if(property.published){
        return res.redirect("/my-properties")
    }

    //Validate user is owner of property
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }

    res.render('properties/add-image',{
        page:`Agregar imagen: ${property.title}`,
        property,
        bar:true,
        csrfToken: req.csrfToken()
    })

}

const saveImage = async (req, res, next)=>{
    const { id } = req.params
    
    //Validate exists property
    const property = await Property.findByPk(id)
    if(!property){
        return res.redirect("/my-properties")
    }
    //Valdate property is not published

    if(property.published){
        return res.redirect("/my-properties")
    }

    //Validate user is owner of property
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }

    try {
        property.image=req.file.filename
        property.published=1
        //Save image and publish property
        property.save()
        next()
    } catch (error) {
        console.log(error);
    }
}

const edit = async (req,res)=>{

    const {id} = req.params

    //Validate exists property
    const property = await Property.findByPk(id)
    if(!property){
        return res.redirect("/my-properties")
    }
 
    //Validate user is owner of property
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }
    
    const [categories, prices] =await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/edit',{
        page:`Editar propiedad ${property.title}`,
        bar:true,
        categories,
        prices,
        csrfToken: req.csrfToken(),
        data:property
    })

}

const saveChanges = async (req,res) =>{
    const {id} = req.params

    //Validate exists property
    const property = await Property.findByPk(id)
    if(!property){
        return res.redirect("/my-properties")
    }
 
    //Validate user is owner of property
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }
    //Validation
    let result = validationResult(req);
    if (!result.isEmpty()){
        const [categories, prices] =await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/edit',{
            page:'Editar propiedad',
            bar:true,
            categories,
            prices, 
            errores: result.array(),
            csrfToken: req.csrfToken(),
            data: req.body
        })
    }
    //Create property


    try {
        const {title, description, bedrooms, parking, wc, street, lat, lng, price: priceId, category: categoryId} = req.body
        property.set({
            title,
            description,
            bedrooms,
            parking,
            wc,
            street,
            lat,
            lng,
            priceId,
            categoryId
        })
        await property.save()
        res.redirect("/my-properties")
    } catch (error) {
        console.log(error);
    }
}

const deleteProperty = async (req, res)=>{
    const { id } = req.params
    //Validate exists property
    const property = await Property.findByPk(id)
    if(!property){
        return res.redirect("/my-properties")
    }
 
    //Validate user is owner of property
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }

    await property.destroy()

    await unlink(`public/uploads/${property.image}`)

    res.redirect("/my-properties")

}

export  {
    admin,
    create,
    save,
    addImage,
    saveImage,
    edit,
    saveChanges,
    deleteProperty
}