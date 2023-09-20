import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateId} from '../helpers/tokens.js'
import { emailRegister} from '../helpers/emails.js'

const formLogin = (req,res)=>{
    res.render('auth/login',{
        autenticado: false,
        page:"Iniciar sesión"
    });
};

const formRegister = (req,res)=>{
    res.render('auth/register',{
        page:"Crear cuenta",
        csrfToken: req.csrfToken()
    });
};

const register = async (req,res)=>{
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
            },
            csrfToken: req.csrfToken()
        });
    }

    const { name, email, password} = req.body;
    //Validate exists user in DB
    const userExists = await User.findOne({
        where: {
            email
        }
    });

    if (userExists){
        return res.render('auth/register',{
            page:"Crear cuenta",
            errores: [{msg:'Usuario ya esta registrado!!'}],
            user:{
                name: req.body.name,
                email: req.body.email
            },
            csrfToken: req.csrfToken()
        });
    }

    const user = await User.create({name,email, password, token:generateId()});

    //Send confirmation email
    await emailRegister({
        name,
        email,
        token: user.token
    })

    res.render('templates/messages',{
        page:"Cuenta creada",
        message: "Se envió un email para confirmar la cuenta",
        csrfToken: req.csrfToken()
    });
    //res.json(user)
};

const confirm = async (req, res)=>{

    const { token } = req.params;
    
    //console.log(`Tokem ${token}`);
    const user = await User.findOne({where:{token}});

    if (!user){
        return res.render('auth/confirm-account',{
            page:"Error al confirmar cuenta",
            message: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
            error:true
        });
    
    }
    //Confirmar cuenta
    user.token=null;
    user.confirmed=true

    await user.save();
    res.render('auth/confirm-account',{
        page:"Cuenta confirmada",
        message: "La cuenta se confirmó correctamente",
        error:false
    });

}
const formRecoveryPassword = (req,res)=>{
    res.render('auth/recovery-password',{
        page:"Recuperar password"
    });
};

export {
    formLogin,
    formRegister,
    register,
    confirm,
    formRecoveryPassword
}