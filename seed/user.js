import bcrypt from 'bcrypt'

const users = [
    {
        name:'Max Zavaleta Villar',
        email: 'max@maxz.com',
        confirmed:true,
        password : bcrypt.hashSync('password',10)
    }
]

export default users