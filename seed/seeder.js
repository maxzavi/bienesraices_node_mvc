import { exit } from 'process';

import categories  from './category.js';
import prices  from './price.js';
import users from './user.js'
import properties from './properties.js';

import {Category, Price, Property, User} from '../models/index.js'

import db from '../config/db.js'

const importData = async ()=>{
    try {
        
        await db.authenticate();

        await db.sync();

        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
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
        await db.sync({force:true});
        console.log('Datos eliminados correctamente');
        exit();
    } catch (error) {
        console.log(error);
        exit(1);    
    }
}

const importDataProperties = async ()=>{
    try {
        
        await db.authenticate();

        await db.sync();

        await Promise.all([
            Property.bulkCreate(properties)
        ])
        console.log('Datos importados correctamente');
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

if (process.argv[2] === "-p"){
    importDataProperties();
}
