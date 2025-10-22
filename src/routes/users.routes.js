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

router.post('/register', register)
router.get('/login', login)
router.get('/acocount', showAccount)
router.put('/upDate', updateAccount)
router.post('/image', uploadImage)
router.put('/setPassword', setPassword)
router.delete('/deleteAccount', deleteAccount)

// router.get('report', reportUsers)

export default router