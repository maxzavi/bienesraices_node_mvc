import { validationResult} from 'express-validator'
import { unlink } from 'node:fs/promises'
import {Category, Price, Property, Message, User} from '../models/index.js'
import { isSeller, formatDate } from '../helpers/index.js';

const admin = async (req,res)=>{
    const { page : pageCurrent }= req.query;
    const expresion = /^[0-9]$/

    if(!expresion.test(pageCurrent)){
        return res.redirect("/my-properties?page=1")
    }
    const limit=5;
    const offset=(limit*pageCurrent)-limit
    try {
        const { id } = req.user
        const [properties,total] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where:{
                    userId:id
                },
                include:[
                    {model: Category, as: 'category'},
                    {model: Price, as:'price'},
                    {model: Message, as:'messages'}
                ]
            })
            , 
            Property.count({
                where : {
                    userId:id
                }
            })
        ]) 
        
        const ceil = Math.ceil(total/limit)

        res.render('properties/admin',{
            page:'Mis propiedades',
            bar: true,
            properties,
            csrfToken: req.csrfToken(),
            pages: ceil,
            pageCurrent: Number(pageCurrent),
            total,
            limit,
            offset
        })
    } catch (error) {
        console.log(error);
    }
   
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
    const { page:pageCurrent } = req.query


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
        data:property,
        pageCurrent
    })

}

const saveChanges = async (req,res) =>{
    const {id} = req.params
    const { pageCurrent } = req.body

    

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
            data: req.body,
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
        res.redirect(`/my-properties?page=${pageCurrent}`)
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

//Change status in property

const changeStatus = async (req, res)=>{
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
    //Update

    property.published = ! property.published

    await property.save()

    res.json({
        result: 'OK'
    })
}

const showProperty = async (req, res)=>{
    const { id } = req.params
    const categories = await Category.findAll()
    //Validate exists property
    const property = await Property.findByPk(id,{
        include:[
            {model: Category, as: 'category'},
            {model: Price, as:'price'}
        ]
    })

    if(!property || !property.published){
        return res.redirect("/404")
    }
 
    res.render("properties/show",{
        bar:true,
        property,
        page:property.title,
        categories,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userId)
    })

}
const sendMessage = async (req,res)=>{
    const { id } = req.params

    const categories = await Category.findAll()
    //Validate exists property
    const property = await Property.findByPk(id,{
        include:[
            {model: Category, as: 'category'},
            {model: Price, as:'price'}
        ]
    })

    if(!property){
        return res.redirect("/404")
    }
    let result = validationResult(req);
    if (!result.isEmpty()){
        const [categories, prices] =await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render("properties/show",{
            bar:true,
            property,
            page:property.title,
            categories,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req.user?.id, property.userId),
            errores: result.array()
        })
    }
 
    const { id:propertyId} = req.params
    const { id:userId} = req.user
    const { message } = req.body

    await Message.create({
        message,
        userId,
        propertyId
    })
    res.render("properties/show",{
        bar:true,
        property,
        page:property.title,
        categories,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userId),
        sent:true
    })
}
const showMessages = async (req,res)=>{
    const { id } = req.params
    //Validate exists property
    const property = await Property.findByPk(id,{
        include:[
            {model: Message, as:'messages',
            include:[
                {model: User.scope('deletePassword'), as:'user'}
            ]}
        ]
    })
    if(!property){
        return res.redirect("/my-properties")
    }
 
    //Validate user is owner of property
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }
 
    res.render('properties/messages',{
        page:'Mensajes',
        bar:true,
        messages: property.messages,
        formatDate
    })
}
export  {
    admin,
    create,
    save,
    addImage,
    saveImage,
    edit,
    saveChanges,
    deleteProperty,
    changeStatus,
    showProperty,
    sendMessage,
    showMessages
}