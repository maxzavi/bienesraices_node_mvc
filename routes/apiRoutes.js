import  express from "express"
import {properties} from '../controller/apiController.js'
import router from "./userroutes.js"

router.get("/properties",properties)

export default router