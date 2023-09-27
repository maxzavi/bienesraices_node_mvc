import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt';
import db from '../config/db.js'

const User = db.define('users',{
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
    },
    scopes:{
        deletePassword:{
            attributes:{
                exclude: ['password','token','confirmed','createdAt','updatedAt']
            }
        }
    }
});

User.prototype.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default User;