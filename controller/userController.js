import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateId} from '../helpers/tokens.js'
import { emailRegister, emailResetPassword} from '../helpers/emails.js'

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
        page:"Recuperar password",
        csrfToken: req.csrfToken()
    });
};

const resetPasswod = async (req, res)=>{
    //Validate
    const { email} = req.body;

    await check('email').isEmail().withMessage('El email no es correcto').run(req);
    let result = validationResult(req);
    if (!result.isEmpty()){
        return res.render('auth/recovery-password',{
            page:"Recuperar password",
            errores: result.array(),
            email,
            csrfToken: req.csrfToken()
        });
    }
    //Find user by mail
    const user = await User.findOne({where:{email}});
    
    if (!user) {
        return res.render('auth/recovery-password',{
            page:"Recuperar password",
            errores: [{msg:"El email no pertenece a un usuario valido"}],
            email,
            csrfToken: req.csrfToken()
        });
    }
    user.token=generateId();
    await user.save();

    //Send confirmation email
    await emailResetPassword({
        name:user.name,
        email,
        token: user.token
    })

    res.render('templates/messages',{
        page:"Restablece tu password",
        message: "Se envió un email con las instrucciones",
        csrfToken: req.csrfToken()
    });

    //console.log(user);
};

const validateToken = async (req, res)=>{
    const { token } = req.params;
    //console.log(token);
    const user = await User.findOne({where:{token}});
    //console.log(user);
    if (!user){
        return res.render('auth/confirm-account',{
            page:"Restablecer tu password",
            message: "Hubo un error al validar tu información, intenta de nuevo",
            error:true
        });
    }
    //Show form by new password

    res.render ('auth/reset-password',{
        page:"Restablecer tu password",
        csrfToken: req.csrfToken()
    })
}

const newPassword = async (req, res)=>{
    //Validate
    await check('password').isLength({min:6}).withMessage('El password debe tener 6 caracteres como minimo').run(req);

    let result = validationResult(req);
    if (!result.isEmpty()){
        return res.render('auth/reset-password',{
            page:"Restablecer password",
            errores: result.array(),
            csrfToken: req.csrfToken()
        });
    }

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({where:{token}});
    if (!user){
        return res.render('auth/reset-password',{
            page:"Restablecer password",
            errores: [{msg:"Usuario incorrecto, favor validar nuevamente"}],
            csrfToken: req.csrfToken()
        });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);
    user.token=null;

    await user.save();

    res.render('auth/confirm-account',{
        page:"Password restablecido",
        message: "El password se guardo correctamente",
    }); 

}

export {
    formLogin,
    formRegister,
    register,
    confirm,
    formRecoveryPassword,
    resetPasswod,
    validateToken,
    newPassword
}