import { exit } from 'process';

import categories  from './category.js';
import Category from '../models/Category.js';

import prices  from './price.js';
import Price from '../models/Price.js';


import db from '../config/db.js'

const importData = async ()=>{
    try {
        
        await db.authenticate();

        await db.sync();

        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices)
        ])
        
        console.log('Datos importados correctamente');

        exit();

    } catch (error) {
       console.log(error);
       exit(1); 
    }
}

const cleanData = async ()=>{
    try {
        /*await Promise.all([
            
            Category.destroy({
                where:{},
                truncate: true
            }),
            Price.destroy({
                where:{},
                truncate: true
            })
        ]);*/
        await db.sync({force:true});
        console.log('Datos eliminados correctamente');

        exit();
    } catch (error) {
        console.log(error);
        exit(1);    
    }
}

if (process.argv[2] === "-i"){
    importData();
}

if (process.argv[2] === "-d"){
    cleanData();
}
