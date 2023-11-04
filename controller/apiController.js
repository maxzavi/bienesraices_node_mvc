import {Property, Price, Category} from '../models/index.js'

const properties = async (req, res)=>{
    const result = await Property.findAll({
        include:[
            {model: Price, as: 'price'},
            {model: Category, as: 'category'}
        ],
        where: {
            published: true
        }
    })
    res.json (result)
}

export{
    properties
}