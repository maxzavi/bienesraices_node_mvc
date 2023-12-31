import express from 'express'
import { category, home, notfound, search } from '../controller/appController.js'
import { indentifyUser } from '../middleware/indentifyUser.js'


const router =  express.Router()


//Home page
router.get("/", indentifyUser, home)

//Categorys
router.get("/category/:id",indentifyUser,category)
//Search
router.get("/search",indentifyUser, search)
router.post("/search",indentifyUser, search)

//Not found 404
router.get("/404", notfound)

export default router