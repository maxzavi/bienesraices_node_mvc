import jwt from 'jsonwebtoken'

const generateJwt = (id, name) => 
    jwt.sign({
        id,
        name
    },process.env.JWT_SECRET,{
        expiresIn:"1d"
    });

const generateId = () => Math.random().toString(32)+ Date.now().toString(32);

export {
    generateJwt,
    generateId
}