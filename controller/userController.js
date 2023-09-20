import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateId} from '../helpers/tokens.js'

const formLogin = (req,res)=>{
    res.render('auth/login',{
        autenticado: false,
        page:"Iniciar sesión"
    });
};

const formRegister = (req,res)=>{
    res.render('auth/register',{
        page:"Crear cuenta"
    });
};

const register = async (req,res)=>{
    console.log(req.body);
    //Validate
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email no es correcto').run(req);
    await check('password').isLength({min:6}).withMessage('El password debe tener 6 caracteres como minimo').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req);

    let result = validationResult(req);
    if (!result.isEmpty()){
        return res.render('auth/register',{
            page:"Crear cuenta",
            errores: result.array(),
            user:{
                name: req.body.name,
                email: req.body.email
            }
        });
    }

    const { name, email, password} = req.body;
    //Validate exists user in DB
    const userExists = await User.findOne({
        where: {
            email
        }
    });

    console.log(userExists);
    if (userExists){
        return res.render('auth/register',{
            page:"Crear cuenta",
            errores: [{msg:'Usuario ya esta registrado!!'}],
            user:{
                name: req.body.name,
                email: req.body.email
            }
        });
    }

    const user = await User.create({name,email, password, token:generateId()});
    res.json(user)
};

const formRecoveryPassword = (req,res)=>{
    res.render('auth/recovery-password',{
        page:"Recuperar password"
    });
};

export {
    formLogin,
    formRegister,
    register,
    formRecoveryPassword
}