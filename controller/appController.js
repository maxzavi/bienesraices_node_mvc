import { raw } from 'mysql2';
import {Category, Price, Property} from '../models/index.js'

const  home = async (req,res)=>{

    //const categories = await Category.findAll()
    
    const [categories, prices, ids1, ids2 ]= await Promise.all([
        Category.findAll({raw : true}),
        Price.findAll({raw : true}),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1
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
                categoryId: 2
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
    console.log(ids1);
    console.log(ids2);
    res.render("home",{
        page:"Inicio",
        bar:true,
        categories,
        prices,
        ids1,
        ids2
    })
}

const  category = (req,res)=>{
    res.send('Hello world!!!')
}

const  search = (req,res)=>{
    res.send('Hello world!!!')
}

const  notfound = (req,res)=>{
    res.send('Hello world!!!')
}

export {
    home,
    category,
    search,
    notfound
}