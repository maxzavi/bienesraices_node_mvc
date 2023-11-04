import { Sequelize } from 'sequelize'
import {Category, Price, Property} from '../models/index.js'

const  home = async (req,res)=>{

    //const categories = await Category.findAll()
    
    const [categories, prices, ids1, ids2 ]= await Promise.all([
        Category.findAll({raw : true}),
        Price.findAll({raw : true}),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1,
                published: true
            },
            include:[
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order:[ ['createdAt','DESC']]
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2,
                published: true
            },
            include:[
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order:[ ['createdAt','DESC']]
        })
    ])
    res.render("home",{
        page:"Inicio",
        bar:true,
        categories,
        prices,
        csrfToken: req.csrfToken(),
        ids1,
        ids2
    })
}

const  category = async (req,res)=>{
    const {id}= req.params
    const category = await  Category.findByPk(id)

    if (!category) return res.redirect("/404")

    const [ categories, properties] = await  Promise.all(
        [
            Category.findAll(),
            Property.findAll({
                where:{
                    categoryId: id,
                    published: true
                },
                include:[
                    {model: Price, as:'price'}
                ]
            })
        ]
    )
    res.render('category',{
        page:`${category.name}s en venta`,
        properties,
        bar:true,
        categories,
        csrfToken: req.csrfToken()
    })
}

const  search = async (req,res)=>{
    const { word } = req.body
    if (!word.trim()){
        res.redirect('back')
    }
    const [properties, categories] = await Promise.all(
        [
            Property.findAll({
                where:{
                    title: {
                        [Sequelize.Op.like]: "%"+word+ "%"
                    },
                    published: true
                },
                include:[
                    {model: Price, as:'price'}
                ]
            }),
            Category.findAll()
        ]
    )
    res.render('search',{
        page:`Resultados de la búsqueda`,
        properties,
        bar:true,
        categories,
        csrfToken: req.csrfToken()
    })
}

const  notfound = async (req,res)=>{
    const categories = await Category.findAll()
    res.render('404',{
        page:'No encontrada',
        bar:true,
        categories,
        csrfToken: req.csrfToken()
    })
}

export {
    home,
    category,
    search,
    notfound
}