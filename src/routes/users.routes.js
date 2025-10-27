import { Router } from "express"
const router = Router()

import {
    register,
    login,
    showAccount,
    updateAccount,
    uploadImage,
    setPassword,
    deleteAccount
 } from "../controllers/users.controllers.js"

 import { verifyToken } from "../middlewares/verify-token.js"

router.post('/register', register)
router.post('/login', login)
router.get('/account',verifyToken, showAccount)
router.put('/upDate', updateAccount)
router.post('/image', uploadImage)
router.put('/setPassword', setPassword)
router.delete('/deleteAccount', deleteAccount)

export default router