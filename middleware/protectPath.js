import jwt from 'jsonwebtoken'
import {User} from '../models/index.js'
const protectPath = async (req, res, next)=>{
    // Exists token?
    const token = req.cookies._token
    if(!token){
        return res.redirect('/user/login')
    }
    //Validate token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.scope('deletePassword').findByPk(decoded.id);
        //Save user in Req
        if(user){
            req.user= user
        }else{
            return res.clearCookie('_token').redirect('/user/login')
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/user/login')
    }
}

export default protectPath