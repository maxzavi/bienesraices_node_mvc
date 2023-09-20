import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt';
import db from '../config/db.js'

const user = db.define('users',{
    name:{
        type: DataTypes.STRING,
        allownull: false
    },
    email:{
        type: DataTypes.STRING,
        allownull: false
    },
    password:{
        type: DataTypes.STRING,
        allownull: false
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
}, {
    hooks:{
        beforeCreate: async (user)=>{
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password,salt);
        }
    }
});

export default user;