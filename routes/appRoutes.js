import express from 'express'
import { category, home, notfound, search } from '../controller/appController.js'


const router =  express.Router()


//Home page
router.get("/", home)

//Categorys
router.get("/category/:id",category)
//Search
router.get("/search", search)
router.post("/search", search)

//Not found 404
router.get("/404", notfound)

export default router