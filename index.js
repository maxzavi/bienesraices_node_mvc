import express from 'express'
import csrf from 'csurf';
import cookieParser from 'cookie-parser'
import userroutes from './routes/userroutes.js'
import db from './config/db.js'

const app = express();
const port = process.env.port || 3000;

try {
    await db.authenticate();
    db.sync();
    console.log('Connected OK');
} catch (error) {
    console.log(error);
}
//Enabled read forms
app.use(express.urlencoded({extended:true}));
//Enable cookie parser
app.use(cookieParser());
//Enable CSRF
app.use(csrf({cookie:true}));
//View
app.set('view engine','pug');
app.set('views','./views');

//Statics
app.use(express.static('public'));

//Routes
app.use("/user",userroutes);

app.listen(port,()=>{
    console.log(`Listening in port: ${port}`);
});