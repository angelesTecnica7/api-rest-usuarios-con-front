
import { verifyToken, verifyT } from "../middlewares/verify-token-cookie.js"
import { Router } from "express"
const router = Router()

import {
    verifySesionOpen,
    register,
    login,
    logout,
    showAccount,
    updateAccount,
    uploadImage,
    setPassword,
    deleteAccount
 } from "../controllers/users.controllers.js"


router.get('/', verifyToken, verifySesionOpen)

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

//rutas protegidas
router.get('/account', verifyToken, showAccount)
router.put('/upDate', verifyToken, updateAccount)
router.post('/image', verifyToken, uploadImage)
router.put('/setPassword', verifyToken, setPassword)
router.delete('/deleteAccount', verifyToken, deleteAccount)

export default router