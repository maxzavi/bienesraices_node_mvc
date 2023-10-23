import { raw } from 'mysql2';
import {Category, Price, Property} from '../models/index.js'

const  home = async (req,res)=>{

    //const categories = await Category.findAll()
    
    const [categories, prices ]= await Promise.all([
        Category.findAll({raw : true}),
        Price.findAll({raw : true})
    ])
    res.render("home",{
        page:"Inicio",
        bar:true,
        categories,
        prices
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